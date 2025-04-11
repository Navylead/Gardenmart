// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Тесты Гарденмарт', ()=>{

test('Получение таймингов загрузки страницы - https://gardenmart24.ru/', async ({ page }) => {
  // Массив для хранения таймингов всех запросов
  const requestTimings = [];

  // Сетевые запросы
  page.on('requestfinished', async (request) => {
    if (request.url() === 'https://gardenmart24.ru/'){
    const timing = request.timing();
    const url = request.url();
    // Вычисляем TTFB и Content Download
    const ttfb = timing.responseStart - timing.requestStart;            // Ответ сервера
    const contentDownload = timing.responseEnd - timing.responseStart;  // Загрузка контента
    // Сохраняем данные в массив
    requestTimings.push({
      url,
      ttfb,
      contentDownload,
    })}
  });
  // Переходим на страницу
  await page.goto('https://gardenmart24.ru');
  // Ожидаем завершения всех сетевых запросов
  await page.waitForLoadState('networkidle');
  // Выводим тайминги в консоль
  console.log('Тайминги загрузки:');
  requestTimings.forEach((timing) => {
    console.log(`URL: ${timing.url}`);
    console.log(`  TTFB: ${timing.ttfb} мс`);
    console.log(`  Content Download: ${timing.contentDownload} мс`);
  });
  // Проверяем, что время TTFB не превышает допустимое значение
  const totalTTFB = requestTimings.reduce((sum, timing) => sum + timing.ttfb, 0);
  const totalContentDownload = requestTimings.reduce((sum, timing) => sum + timing.contentDownload, 0);
  const total = totalTTFB+totalContentDownload
  console.log('<<<ОБЩЕЕ ЗАТРАЧЕННОЕ>>>', totalContentDownload)
  expect(totalContentDownload).toBeLessThan(700); // Проверка, что загрузка контента происходит менее 700 мс

  // await page.pause()
});
})