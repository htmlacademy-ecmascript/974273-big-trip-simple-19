import View from './view';
import {html} from '../utils';

export default class ListView extends View {
  constructor () {
    super();

    this.classList.add('');
  }

  /**
   * @override
   */
  createHtml() {
    return html`
			<ul class="trip-events__list"></ul>
		`;
  }
}

customElements.define(String(ListView), ListView);
