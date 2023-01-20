import {html} from '../utils';
import NewPointEditorView from './new-point-editor-view';

export default class PointEditorView extends NewPointEditorView {
  constructor () {
    super(...arguments);

    this.pointView = null;

    this.awaitDelete(false);
    this.querySelector('header').insertAdjacentHTML('beforeend', this.createCloseButtonHtml());
  }

  open() {
    super.open();
    this.pointView = this.listView.findById(this.dataset.id);
    this.pointView.replaceWith(this);
  }

  /**
   * @override
   */
  close() {
    this.replaceWith(this.pointView);
    this.pointView = null;
    super.close(...arguments);
  }

  createCloseButtonHtml() {
    return html`
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Close event</span>
      </button>
    `;
  }

  /**
   * @param {boolean} flag
   */
  awaitDelete(flag) { }
}

customElements.define(String(PointEditorView), PointEditorView);
