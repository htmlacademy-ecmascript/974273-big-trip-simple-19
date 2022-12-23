import View from './view';
// import {html} from '../utils';
import PointView from './point-view';

export default class ListView extends View {
  // constructor () {
  //   super();

  //   this.classList.add('');
  // }

  /**
  * @param {PointViewState[]} states
  */
  setItems(states) {
    const views = states.map((state) => new PointView(state));

    this.replaceChildren(...views);
  }

  // /**
  //  * @override
  //  */
  // createHtml() {
  //   return html`
  // 		<ul class="trip-events__list"></ul>
  // 	`;
  // }
}

customElements.define(String(ListView), ListView);
