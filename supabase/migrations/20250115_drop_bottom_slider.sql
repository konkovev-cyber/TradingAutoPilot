-- Remove the old bottom slider section; glass bot cards now live in the "products" slot

DELETE FROM site_sections WHERE key = 'cta';

-- Renumber remaining sections for a clean order
UPDATE site_sections SET position = 2 WHERE key = 'products';
UPDATE site_sections SET position = 3 WHERE key = 'why';
UPDATE site_sections SET position = 4 WHERE key = 'connect';
UPDATE site_sections SET position = 5 WHERE key = 'advantages';
UPDATE site_sections SET position = 6 WHERE key = 'benefits';
UPDATE site_sections SET position = 7 WHERE key = 'pricing';
UPDATE site_sections SET position = 8 WHERE key = 'conclusion';
UPDATE site_sections SET position = 9 WHERE key = 'questions';
UPDATE site_sections SET position = 10 WHERE key = 'faq';
UPDATE site_sections SET position = 11 WHERE key = 'calculator';
UPDATE site_sections SET position = 12 WHERE key = 'lead';
