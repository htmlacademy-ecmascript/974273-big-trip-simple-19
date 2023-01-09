// NOTE: Иконка-кнопка выбора типа транспорта на редакторе точки маршрута

import {pointIconMap} from '../../maps';
import {html} from '../../utils';
import RadioGroupView from '../radio-group-view';
import './point-type-view.css';

export default class PointTypeView extends RadioGroupView {
  constructor () {
    super();

    this.classList.add('event__type-wrapper');

    // NOTE: Слушатель 'change' для отрисовка иконок типа транспорта в нужном месте при переходе стрелками с клавиатуры по выпадающему меню.
    this.addEventListener('change', this.handleChange);
    // NOTE: Слушатель клавиши 'esc' для закрытия меню типа транспорта и отмены закрытия всего редактора точки маршрута.
    this.addEventListener('keydown', this.handleKeyDown);
    // NOTE: Слушатель ухода фокуса или нажатия мышки в любом месте с меню тип транспорта, тогда выполняем функцию
    this.addEventListener('blur', this.handleBlur, true);
    this.addEventListener('pointerup', this.handlePointerUp);
  }

  /**
   * @override
   * @param {string} value
   */
  setValue(value) {
    super.setValue(value);

    if (pointIconMap[value]) {
      /**
       * @type {HTMLImageElement}
       */
      (this.querySelector('.event__type-icon')).src = pointIconMap[value];
    }
  }

  /**
   * @override
   */
  createHtml() {
    return html`
      <label class="event__type  event__type-btn" for="event-type-toggle-1" tabIndex="-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
        </fieldset>
      </div>
		`;
  }

  /**
   * @param {OptionViewState} state
   */
  createOptionHtml(state) {
    return html`
      <div class="event__type-item">
        <input 
          id="event-type-${state.value}-1" 
          class="event__type-input  visually-hidden" 
          type="radio" 
          name="event-type" 
          value="${state.value}"
        >
        <label 
          class="event__type-label  
          event__type-label--${state.value}" 
          for="event-type-${state.value}-1"
          tabIndex="-1">
          ${state.title}
        </label>
      </div>
    `;
  }

  /**
   * @param {OptionViewState[]} states
   */
  setOptions(states) {
    const optionsHtml = states.map(this.createOptionHtml).join('');

    this.querySelector('fieldset').insertAdjacentHTML('beforeend', optionsHtml);
  }

  open() {
    /**
     * @type {HTMLInputElement}
     */
    (this.querySelector('.event__type-toggle')).checked = true;

    // NOTE: Фокусирование типа транспорта при переходе стрелками с клавиатуры для активации выбора радиокнопки
    /**
     * @type {HTMLInputElement}
     */
    (this.querySelector('.event__type-input:checked')).focus();
  }

  close() {
    /**
     * @type {HTMLInputElement}
     */
    (this.querySelector('.event__type-toggle')).checked = false;
  }

  /**
   * @param {Event & {target: HTMLInputElement}} event
   */
  handleChange(event) {
    // NOTE: предотвращаем вызов других слушателей события 'change', чтобы исключить сброс выбранных офферов (offers)
    if (event.target.type === 'checkbox') {
      return event.stopImmediatePropagation();
    }
    this.setValue(event.target.value);
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleKeyDown(event) {
    // NOTE: Проверка открытия меню типа транспорта ('.event__type-toggle:checked'), тогда закрытие.
    if (event.key === 'Escape' && this.querySelector('.event__type-toggle:checked')) {
      event.stopPropagation();
      this.close();
    }

    // NOTE: Клавиша пробел, отлавливает проверкой
    else if (event.key === ' ') {
      this.open();
    }
  }

  /**
   * @param {FocusEvent & {relatedTarget: Element}} event
   */
  handleBlur(event) {
    if (!this.contains(event.relatedTarget)) {
      this.close();
    }
  }

  /**
   * @param {PointerEvent & {target: Element}} event
   */
  handlePointerUp(event) {
    if (event.target.closest('.event__type-item')) {
      this.close();
    }
  }
}

customElements.define(String(PointTypeView), PointTypeView);
