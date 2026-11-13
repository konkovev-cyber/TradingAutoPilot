import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/lib/translations.ts', 'utf8');

// Update hero badge and headings
content = content.replace(
  '"badge": "20+ бирж · ИИ-торговля 24/7"',
  '"badge": "Уникальные алгоритмы · AI-торговля 24/7"'
);
content = content.replace(
  '"heading1": "Торговые боты для криптобирж"',
  '"heading1": "Торговые роботы нового уровня"'
);
content = content.replace(
  '"heading2": "и акций"',
  '"heading2": "для криптовалют и акций"'
);
content = content.replace(
  '"subtitle": "Боты на ИИ торгуют на 20+ биржах через API. Средняя доходность портфеля — +96.4% за год. Работают 24/7."',
  '"subtitle": "Автоматизируйте торговлю и освободите своё время с помощью роботов TradingAutoPilot. Наша команда занимается разработками алгоритмов, готовых роботов, проводит бэктесты и подбирает настройки. Полная тех.поддержка 24/7 каждому пользователю."'
);

// Update security card in projectSlides carousel
content = content.replace(
  '"title": "API, безопасность и контроль"',
  '"title": "Безопасность и контроль"'
);
content = content.replace(
  '"desc": "Вы подключаете API-ключ только с правом торговли. Средства и право вывода всегда остаются на вашем аккаунте биржи."',
  '"desc": "Торговля всех роботов производится через API-ключи биржи с запретом на вывод средств. Ваши средства в безопасности, стабильная связь ботов с биржей гарантировано обеспечивается."'
);

writeFileSync('src/lib/translations.ts', content, 'utf8');
console.log('Done. All changes applied to translations.ts');

