const fs = require("fs");
let c = fs.readFileSync("src/App.tsx", "utf8");
c = c.replace(
  'import { BrowserRouter, Routes, Route } from \'react-router-dom\';',
  'import { BrowserRouter, Routes, Route } from \'react-router-dom\';\nimport { I18nProvider } from \'./lib/i18n\';'
);
c = c.replace('<BrowserRouter>', '<I18nProvider><BrowserRouter>');
c = c.replace('</BrowserRouter>', '</BrowserRouter></I18nProvider>');
fs.writeFileSync("src/App.tsx", c, "utf8");
console.log("App.tsx updated");
console.log(fs.readFileSync("src/App.tsx", "utf8"));