import {PointType} from '../enums';
import {pointTitleMap} from '../maps';
import {formatNumber} from '../utils';
import Presenter from './presenter';

/**
 * @template {NewPointEditorView} View
 * @extends {Presenter<View>}
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

    // NOTE: Формат даты по ТЗ
    // NOTE: Неделя начинается в понедельник
    // NOTE: 24 часа вместо AM/PM
    this.view.datesView.setConfig({
      dateFormat: 'd/m/y H:i',
      locale: {firstDayOfWeek: 1},
      'time_24hr': true
    });

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
    this.view.datesView.setValues([point.startDate, point.endDate]);
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
   * @param {PointAdapter} point
   */
  async save(point) {
    await this.pointsModel.add(point);
  }

  /**
   * @param {SubmitEvent} event
   */
  // NOTE: Добавления новой точки - handleViewSubmit
  async handleViewSubmit(event) {
    event.preventDefault();

    this.view.awaitSave(true);

    try {
      const point = this.pointsModel.item();
      const destinationName = this.view.destinationView.getValue();
      const destination = this.destinationsModel.findBy('name', destinationName);
      const [startDate, endDate] = this.view.datesView.getValues();

      point.type = this.view.pointTypeView.getValue();
      point.destinationId = destination?.id;
      point.startDate = startDate;
      point.endDate = endDate;
      point.basePrice = this.view.basePriceView.getValue();
      point.offerIds = this.view.offersView.getValues();

      await this.save(point);
      this.view.close();
    }

    catch (exception) {
      this.view.shake();
      // FIXME: cause - разобраться
      if (exception.cause?.error) {
        const [{fieldName}] = exception.cause.error;

        this.view.findByName(fieldName)?.focus();
      }
    }

    this.view.awaitSave(false);
  }

  /**
   * @param {Event} event
   */
  handleViewReset(event) {
    // NOTE: void - эмитация использования event, аналогично как event.preventDefault();
    void event;
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
