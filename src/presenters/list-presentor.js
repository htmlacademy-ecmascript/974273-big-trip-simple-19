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
    this.pointsModel.addEventListener('filter', this.handlePointsModelFilter.bind(this));
    this.pointsModel.addEventListener('sort', this.handlePointsModelSort.bind(this));
  }

  updateView() {
    this.view.setItems(
      this.pointsModel.list().map(this.createPointViewState, this)
    );
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

  handlePointsModelFilter() {
    this.updateView();
  }

  handlePointsModelSort() {
    this.updateView();
  }
}
