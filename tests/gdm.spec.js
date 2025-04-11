// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Тесты Гарденмарт', ()=>{

test('Получение таймингов загрузки страницы - https://gardenmart24.ru/', async ({ page }) => {
  // Массив для хранения таймингов всех запросов
  const requestTimings = [];

  // Отслеживаем все сетевые запросы
  page.on('requestfinished', async (request) => {
    if (request.url() === 'https://gardenmart24.ru/'){
    const timing = request.timing();
    const url = request.url();
    // Вычисляем TTFB и Content Download
    const ttfb = timing.responseStart - timing.requestStart; // Waiting for server response
    const contentDownload = timing.responseEnd - timing.responseStart; // Content Download
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
  console.log('<<<ОБЩЕЕ ЗАТРАЧЕННОЕ>>>', total)
  expect(total).toBeLessThan(1); // Например, менее 1 секунды

  // await page.pause()
});
})