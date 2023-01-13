import {PointType} from '../enums';
import {pointTitleMap} from '../maps';
import {formatNumber} from '../utils';
import Presenter from './presenter';

/**
 * @extends {Presenter<NewPointEditorView>}
 */
export default class NewPointEditorPresenter extends Presenter {
  constructor () {
    super(...arguments);

    // NOTE: Преобразование объекта pointTitleMap в список из объектов для view PointTypeView
    const pointTypeOptions =
      Object.entries(pointTitleMap).map(([value, title]) => ({title, value}));
    // NOTE: Отрисовываем список типа транспорта на странице
    this.view.pointTypeView.setOptions(pointTypeOptions);
    // NOTE: Выбор типа транспорта по умолчанию при загрузке страницы
    this.view.pointTypeView.setValue(PointType.BUS);

    // NOTE: Преобразование списка объектов destinationsModel в список из объектов для view DestinationView
    const pointDestinationOptions = this.destinationsModel.listAll().map(({name}) => ({title: '', value: name}));

    this.view.destinationView.setOptions(pointDestinationOptions);
    this.view.destinationView.addEventListener('input', this.handleDestinationValueInput.bind(this));

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
    this.view.destinationView.setLabel(point.type);
    this.view.destinationView.setValue(destination.name);
    this.view.basePriceView.setValue(point.basePrice);

    // NOTE: Обновить список предложений
    this.updateOffersView(point.offerIds);
    this.updateDestinationDetailsView(destination);
  }

  /**
   * @param {string[]} offerIds
   */
  updateOffersView(offerIds = []) {
    const pointType = this.view.pointTypeView.getValue();
    const offerGroup = this.offerGroupsModel.findById(pointType);

    const options = offerGroup.items.map((offer) => ({
      ...offer,
      price: formatNumber(offer.price),
      checked: offerIds.includes(offer.id)
    }));

    this.view.offersView.setOptions(options);
    this.view.offersView.hidden = !options.length;
  }

  /**
   * @param {DestinationAdapter} [destination]
   */
  updateDestinationDetailsView(destination) {
    this.view.destinationDetailsView.hidden = !destination;
    if (destination) {
      this.view.destinationDetailsView.setContent(destination);
    }
  }

  /**
   * @override
   */
  handleNavigation() {
    if (this.location.pathname === '/new') {

      const point = this.pointsModel.item();

      point.type = PointType.TAXI;
      point.destinationId = this.destinationsModel.item(0).id;
      point.startDate = new Date().toJSON();
      point.endDate = point.startDate;
      point.basePrice = this.pointsModel.findBy('type', PointType.TAXI).basePrice;
      point.offerIds = this.pointsModel.findBy('type', PointType.TAXI).offerIds;

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

    // NOTE: Обновить список предложений
    this.updateOffersView();
  }

  handleDestinationValueInput() {
    const destinationName = this.view.destinationView.getValue();
    const destination = this.destinationsModel.findBy('name', destinationName);

    this.updateDestinationDetailsView(destination);
  }
}
