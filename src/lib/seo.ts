import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description: string;
  jsonLd?: object | object[];
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSeo({ title, description, jsonLd }: SeoOptions) {
  const json = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    let script: HTMLScriptElement | null = null;
    if (json) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = json;
      document.head.appendChild(script);
    }
    return () => {
      if (script && script.parentNode) script.parentNode.removeChild(script);
    };
  }, [title, description, json]);
}
