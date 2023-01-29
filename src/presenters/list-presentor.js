import {pointIconMap, pointTitleMap} from '../maps';
import {formatDate, formatTime, formatNumber} from '../utils';
import Presenter from './presenter';

/**
 * @extends {Presenter<ListView>}
 */
export default class ListPresenter extends Presenter {
  constructor () {
    super(...arguments);

    this.updateView();

    this.view.addEventListener('edit', this.handleViewEdit.bind(this));

    this.pointsModel.addEventListener('filter', this.handlePointsModelFilter.bind(this));
    this.pointsModel.addEventListener('sort', this.handlePointsModelSort.bind(this));
    this.pointsModel.addEventListener('add', this.handlePointsModelAdd.bind(this));
    this.pointsModel.addEventListener('update', this.handlePointsModelUpdate.bind(this));
    this.pointsModel.addEventListener('delete', this.handlePointsModelDelete.bind(this));
  }

  /**
   * @param {PointAdapter} [targetPoint]
   */
  updateView(targetPoint) {
    const points = this.pointsModel.list();
    const pointViewStates = points.map(this.createPointViewState, this);

    const pointViews = this.view.setItems(pointViewStates);

    // NOTE: Условие выбора применения анимации к одной точке или ко всем
    if (targetPoint) {
      // NOTE: targetPoint - метод передаваемый аргументом
      this.view.findById(targetPoint.id)?.fadeInLeft();
    } else {
      pointViews.forEach((pointView, index) => {
        pointView.fadeInLeft({delay: 100 * index});
      });
    }
  }

  /**
   * @param {PointAdapter} point
   */
  createPointViewState(point) {
    const destination = this.destinationsModel.findById(point.destinationId);
    const offersTypes = this.offerGroupsModel.findBy('id', point.type).items;

    const offersTypeActive = offersTypes
      .filter((itemTyp) => point.offerIds.includes(itemTyp.id))
      .map((item) => ({
        title: item.title,
        price: formatNumber(item.price)
      }));

    return {
      id: point.id,
      date: formatDate(point.startDate),
      icon: pointIconMap[point.type],
      title: `${pointTitleMap[point.type]} ${destination.name}`,
      startTime: formatTime(point.startDate),
      startDate: point.startDate,
      endTime: formatTime(point.endDate),
      endDate: point.endDate,
      basePrice: formatNumber(point.basePrice),
      offers: offersTypeActive
    };
  }

  /**
   * @param {CustomEvent & {target: PointView}} event
   */
  // NOTE: Добавляет '/edit' в адресную строку при открытии редактора точки
  handleViewEdit(event) {
    this.navigate('/edit', event.target.dataset);
  }

  handlePointsModelFilter() {
    this.updateView();
  }

  handlePointsModelSort() {
    this.updateView();
  }

  /**
   * @param {CustomEvent<PointAdapter>} event
   */
  handlePointsModelAdd(event) {
    this.updateView(event.detail);
  }

  /**
   * @param {CustomEvent<{newItem: PointAdapter}>} event
   */
  handlePointsModelUpdate(event) {
    this.updateView(event.detail.newItem);
  }

  /**
   * @param {CustomEvent<PointAdapter>} event
   */
  handlePointsModelDelete(event) {
    this.updateView(event.detail);
  }
}
