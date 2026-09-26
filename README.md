# Coinsofter  Торговые боты для криптобирж

Современный лендинг для платформы автоматизированной торговли криптоботами.

## Стек

- **Vite 5** + **React 18** + **TypeScript**
- **Tailwind CSS v3**  стилизация
- **Framer Motion**  анимации
- **Lucide React**  иконки
- **React Router v7**  роутинг
- **Supabase**  бэкенд (опционально)

## ыстрый старт

```bash
npm install
npm run dev
```

ткрыть http://localhost:5173

## Сборка

```bash
npm run build      # production build  dist/
npm run preview    # локальный превью билда
npm run typecheck  # TypeScript проверка
```

## еплой на Vercel

1. агрузите репозиторий на GitHub
2. мпорт в [Vercel](https://vercel.com)  проект настроен автоматически
3. ли через CLI:
   ```bash
   npx vercel
   ```

астройки в `vercel.json`:
- Build: `npm run build`
- Output: `dist`
- Framework: `vite`

## еплой на обычный хостинг

осле `npm run build` получится статика в папке `dist/`. агрузите её на любой статический хостинг (nginx, Apache, Netlify, и т.д.).

## Структура

```
src/
  components/     # се UI-компоненты
  data/           # оковые данные (боты, контент)
  lib/            # тилиты (i18n, theme, supabase)
  pages/          # Страницы (HomePage, BotDetailPage)
  App.tsx         # оутинг
  main.tsx        # Точка входа
  index.css       # Global styles + design system
public/           # Статика (favicon, og-image)
supabase/         # Migrations
```

## изайн-система

ветовая палитра (тёмная тема по умолчанию):
- Background: `#050A14`
- Primary accent: `#00FFB2` (неоновый зелёный)
- Secondary: `#00D4FF` (циан)
- Accent: `#7B61FF` (фиолетовый)
- Text: `#F1F5F9` / `#94A3B8` / `#64748B`

омпоненты UI доступны через CSS-классы:
- `.glass` / `.glass-strong`  стеклянные карточки
- `.btn-primary` / `.btn-secondary`  кнопки
- `.card-hover`  карточки с hover-эффектом
- `.heading-xl` / `.heading-lg` / `.heading-md`  типографика
- `.text-gradient-primary`  градиентный текст
