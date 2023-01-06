// NOTE: View - список городов назначения
// FIXME: Выполнить домашку.

import View from '../view';
import {html} from '../../utils';

export default class DestinationView extends View {
  constructor () {
    super();

    this.classList.add('event__field-group');
    this.classList.add('event__field-group--destination');
  }

  /**
    * @param {string} value
    */
  setValue(value) {
    this.querySelector('input').value = value;
  }

  getValue() {
    return this.querySelector('input').value;
  }

  /**
    * @param {string} label
    */
  setLabel(label) {
    this.querySelector('label').textContent = label;
  }

  /**
   * @override
   */
  createHtml() {
    return html`
      <label class="event__label  event__type-output" for="event-destination-1">
        Flight
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1">
      <datalist id="destination-list-1">
        <option value="Amsterdam"></option>
        <option value="Geneva"></option>
        <option value="Chamonix"></option>
      </datalist>
		`;
  }

  /**
   * @param {DestinationViewState} state
   */
  createOptionHtml(state) {
    return html`
      <option value="${state.name}"></option>
    `;
  }

  /**
   * @param {DestinationViewState[]} states
   */
  setOptions(states) {
    const optionsHtml = states.map(this.createOptionHtml).join('');

    this.querySelector('datalist').insertAdjacentHTML('beforeend', optionsHtml);
  }
}

customElements.define(String(DestinationView), DestinationView);
