// NOTE: Добавления текста при отсутствии точек маршрута

import {emptyListTextMap, filterCallbackMap} from '../maps';
import {findKey} from '../utils';
import Presenter from './presenter';

/**
 * @extends Presenter<HTMLParagraphElement>
 */
export default class EmptyListPresenter extends Presenter {
  constructor () {
    super(...arguments);

    // NOTE: Пользовательские события
    this.pointsModel.addEventListener('add', this.handlePointsModelAdd.bind(this));
    this.pointsModel.addEventListener('update', this.handlePointsModelUpdate.bind(this));
    this.pointsModel.addEventListener('delete', this.handlePointsModelDelete.bind(this));
    this.pointsModel.addEventListener('filter', this.handlePointsModelFilter.bind(this));
  }

  updateView() {
    // NOTE: Находим массив с точками маршрута
    const points = this.pointsModel.list();
    // NOTE: Находим свойство
    const filter = this.pointsModel.getFilter();
    // NOTE: Название выбранного фильтра
    const filterType = findKey(filterCallbackMap, filter);

    // NOTE: Прячем текст по условию
    this.view.hidden = (this.location.pathname === '/new') || Boolean(points.length);

    // NOTE: Выводим текста при не выполнении условия.
    this.view.textContent = emptyListTextMap[filterType];
  }

  /**
   * @override
   */
  handleNavigation() {
    this.updateView();
  }

  handlePointsModelAdd() {
    this.updateView();
  }

  handlePointsModelUpdate() {
    this.updateView();
  }

  handlePointsModelDelete() {
    this.updateView();
  }

  handlePointsModelFilter() {
    this.updateView();
  }
}
