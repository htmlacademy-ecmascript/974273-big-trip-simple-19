import Presenter from './presenter';

/**
 * @extends {Presenter<NewPointEditorView>}
 */
export default class NewPointEditorPresenter extends Presenter {
  constructor () {
    super(...arguments);

    this.view.addEventListener('submit', this.handleViewSubmit.bind(this));
  }

  /**
   * @override
   */
  handleNavigation() {
    if (this.location.pathname === '/new') {
      this.view.open();
    } else {
      this.view.close();
    }
  }

  /**
   * @param {SubmitEvent} event
   */
  handleViewSubmit(event) {
    event.preventDefault();
  }
}
