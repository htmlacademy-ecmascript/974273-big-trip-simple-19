import {pointIconMap} from '../maps';
import {formatDate} from '../utils';
import Presenter from './presenter';

/**
 * @extends {Presenter<ListView>}
 */
export default class ListPresenter extends Presenter {
  constructor () {
    super(...arguments);

    this.updateView();
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
    return {
      date: formatDate(point.startDate),
      icon: pointIconMap[point.type],
      title: '',
      startTime: '',
      startDate: '',
      endTime: '',
      endDate: '',
      basePrice: '',
      offers: []
    };
  }
}
