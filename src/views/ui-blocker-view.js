import View from './view';
import './ui-blocker-view.css';

export default class UiBlockerView extends View {
  constructor () {
    super();

    this.classList.add('ui-blocker');
  }

  /**
   * @param {boolean} flag
   */
  toggle(flag) {
    if (flag) {
      document.body.append(this);
      // NOTE: Обработчик блокировки нажатия любой клавиши при preloader
      document.addEventListener('keydown', this.handleKeyDown);
    } else {
      this.remove();
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleKeyDown(event) {
    event.preventDefault();
  }

}

customElements.define(String(UiBlockerView), UiBlockerView);
