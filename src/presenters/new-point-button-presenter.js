import Presenter from './presenter';

/**
 * @extends {Presenter<HTMLButtonElement>}
 */
export default class NewPointButtonPresenter extends Presenter {
  constructor () {
    super(...arguments);

    this.view.addEventListener('click', this.handleViewClick.bind(this));

  }

  /**
   * @override
   */
  handleNavigation() {
    if (this.location.pathname === '/new') {
      this.view.disabled = true;
    } else {
      this.view.disabled = false;
    }
  }

  handleViewClick() {
    this.navigate('/new');
  }
}
