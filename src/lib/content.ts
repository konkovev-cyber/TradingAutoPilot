import { supabase } from './supabase';

export interface SiteContent {
  [section: string]: any;
}

const CACHE_KEY = 'coinsofter-content-cache';

export async function fetchAllContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from('site_content')
    .select('section, data');

  if (error) {
    console.warn('Failed to fetch content from Supabase, using cache:', error.message);
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  }

  const result: SiteContent = {};
  for (const row of data) {
    result[row.section] = row.data;
  }

  localStorage.setItem(CACHE_KEY, JSON.stringify(result));
  return result;
}

export async function updateContent(section: string, data: any): Promise<boolean> {
  const { error } = await supabase
    .from('site_content')
    .upsert({ section, data }, { onConflict: 'section' });

  if (error) {
    console.error('Failed to update content:', error.message);
    return false;
  }

  const cached = localStorage.getItem(CACHE_KEY);
  const cache = cached ? JSON.parse(cached) : {};
  cache[section] = data;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

  return true;
}
