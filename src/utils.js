// NOTE: urils.js файл вспомогательных функций

// NOTE: "he" пакет для безопасности кода от хакеров
// NOTE: {escape} функция из пакета "he" для экранирования html кода для безопасности
// NOTE: {escape} Эта функция принимает строку текста и экранирует ее для использования в текстовом контексте в документах XML или HTML. Экранируются только следующие символы: &, <, >, ", ', и `.
import {escape} from 'he';
import dayjs from 'dayjs';

/**
 * @param {TemplateStringsArray} strings
 * @param {...*} values
 */
// NOTE: html - функция безопасного использования HTML, экранирует коды вставленные в разметку
// NOTE: html - функция, которая позволяет разбирать шаблонную строку.
export const html = (strings, ...values) => strings.reduce((before, after, index) => {
  const value = values[index - 1];

  return before + escape(String(value)) + after;
});

/**
 * @param {string} value
 */
export const formatDate = (value) => dayjs(value).format('MMM D');

/**
 * @param {string} value
 */
export const formatTime = (value) => dayjs(value).format('HH:mm');

/**
 * @param {number} value
 */
export const formatNumber = (value) => value.toLocaleString('en');

/**
 * @param {Object} target
 * @param {*} value
 */
export const findKey = (target, value) => Object.keys(target).find((key) => target[key] === value);
