import {PointType} from '../enums';
import {pointTitleMap} from '../maps';
import Presenter from './presenter';

/**
 * @extends {Presenter<NewPointEditorView>}
 */
export default class NewPointEditorPresenter extends Presenter {
  constructor () {
    super(...arguments);

    const pointTypeOptions =
      Object.entries(pointTitleMap).map(([value, title]) => ({title, value}));

    this.view.pointTypeView.setOptions(pointTypeOptions);
    // TODO: Выбор типа транспорта по умолчанию
    this.view.pointTypeView.setValue(PointType.BUS);


    this.view.pointTypeView.addEventListener('change', this.handlePointTypeViewChange.bind(this));

    this.view.addEventListener('submit', this.handleViewSubmit.bind(this));
    this.view.addEventListener('reset', this.handleViewReset.bind(this));
    this.view.addEventListener('close', this.handleViewClose.bind(this));
  }

  /**
   * @param {PointAdapter} point
   */
  updateView(point) {
    const destination = this.destinationsModel.findById(point.destinationId);

    this.view.pointTypeView.setValue(point.type);
    this.view.destinationView.setLabel(pointTitleMap[point.type]);
    this.view.destinationView.setLabel(destination.name);

    // TODO: Обновить список предложений
    this.updateOffersView(point.offerIds);
  }

  /**
   * @param {string[]} offerIds
   */
  updateOffersView(offerIds = []) { }

  /**
   * @override
   */
  handleNavigation() {
    if (this.location.pathname === '/new') {

      const point = this.pointsModel.item();

      point.type = PointType.BUS;
      point.destinationId = this.destinationsModel.item(0).id;
      point.startDate = new Date().toJSON();
      point.endDate = point.startDate;
      point.basePrice = 100;
      // point.offerIds = [];

      this.view.open();

      this.updateView(point);

    } else {
      this.view.close(false);
    }
  }

  /**
   * @param {SubmitEvent} event
   */
  handleViewSubmit(event) {
    event.preventDefault();
  }

  handleViewReset() {
    this.view.close();
  }

  handleViewClose() {
    this.navigate('/');
  }

  handlePointTypeViewChange() {
    const pointType = this.view.pointTypeView.getValue();

    this.view.destinationView.setLabel(pointTitleMap[pointType]);

    // TODO: Обновить список предложений
    this.updateOffersView();
  }
}
