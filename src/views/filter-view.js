import {html} from '../utils';
import RadioGroupView from './radio-group-view';

export default class FilterView extends RadioGroupView {
  constructor () {
    super();

    // NOTE: Класс кастомного тега, родительского элемента
    this.classList.add('trip-filters');
  }

  /**
   * @param {OptionViewState} state
   */
  createOptionHtml(state) {
    // NOTE: html описание: https://doka.guide/js/template-strings/#tegovyy-shablon
    // NOTE: html кастомная функция для отображеия кода в DOM дереве
    // NOTE: html она приходит из файла utils.js
    // NOTE: html - функция безопасного использования HTML, экранирует коды вставленные в разметку
    // NOTE: html - функция, которая позволяет разбирать шаблонную строку.
    // export const html = (strings, ...values) => strings.reduce((before, after, index) => {
    //   const value = values[index - 1];

    //   return before + escape(String(value)) + after;
    // });
    return html`
      <div class="trip-filters__filter">
        <input
          id="filter-${state.value}" 
          class="trip-filters__filter-input  
          visually-hidden" 
          type="radio" 
          name="trip-filter" 
          value="${state.value}"
          disabled="disabled"
        >
        <label 
          class="trip-filters__filter-label" 
          for="filter-${state.value}">
          ${state.title}
        </label>
      </div>
    `;
  }

  /**
   * @param {OptionViewState[]} states
   */
  setOptions(states) {
    this.innerHTML = states.map(this.createOptionHtml).join('');
  }
}

// NOTE: customElements.define() - производит регистрацию кастомного элемента в DOM дереве.
// NOTE: customElements.define() - первый аргумент это название вайла и тега в разметке
// NOTE: customElements.define() - в данном случае встроенным методом String(FilterView) мы приводим первый аргумент к нужному виду
// NOTE: customElements.define() - второй аргумент это название класса в котором будет создан DOM элемент
customElements.define(String(FilterView), FilterView);
