// NOTE: Ниже импорты (5 шт.) сразу отрисовывают Вьюшки в разметке страницы
import FilterView from './views/filter-view';
import NewPointEditorView from './views/new-point-editor-view';
import ListView from './views/list-view';
import SortView from './views/sort-view';
import PointEditorView from './views/point-editor-view';

import Store from './store';

import CollectionModel from './models/collection-model';

import PointAdapter from './adapters/point-adapter';
import DestinationAdapter from './adapters/destination-adapter';
import OfferGroupAdapter from './adapters/offer-group-adapter';

import {filterCallbackMap, sortCallbackMap} from './maps';
import {FilterType, SortType} from './enums';

import FilterPresenter from './presenters/filter-presenter';
import ListPresenter from './presenters/list-presenter';
import SortPresenter from './presenters/sort-presenter';
import EmptyListPresenter from './presenters/empty-list-presenter';
import NewPointButtonPresenter from './presenters/new-point-button-presenter';
import NewPointEditorPresenter from './presenters/new-point-editor-presenter';
import PointEditorPresenter from './presenters/point-editor-presenter';

const BASE = 'https://19.ecmascript.pages.academy/big-trip-simple';
const AUTH = 'Basic er883jdzbdwkjl';

/**
 * @type {Store<Point>}
 */
const pointsStore = new Store(`${BASE}/points`, AUTH);
// NOTE: pointsModel ????? для чего?
// NOTE: pointsModel это я так думаю для приведения данных к адаптации вида данных
// NOTE: pointsModel и для срабатывания повторного запроса к серверу при изменении структуры данных в коллекции
// NOTE: pointsModel это будет срабатывать за счет встроенного интерфейса EventTarget
const pointsModel = new CollectionModel({
  store: pointsStore,
  adapt: (item) => new PointAdapter(item),
  filter: filterCallbackMap[FilterType.EVERYTHING],
  sort: sortCallbackMap[SortType.DAY],
});

/**
 * @type {Store<Destination>}
 */
const destinationsStore = new Store(`${BASE}/destinations`, AUTH);
// NOTE: destinationsModel ????? для чего?
// NOTE: destinationsModel аналогично pointsModel
const destinationsModel = new CollectionModel({
  store: destinationsStore,
  adapt: (item) => new DestinationAdapter(item)
});

/**
 * @type {Store<OfferGroup>}
 */
const offerGroupsStore = new Store(`${BASE}/offers`, AUTH);
// NOTE: offerGroupsModel ????? для чего?
// NOTE: offerGroupsModel аналогично pointsModel
const offerGroupsModel = new CollectionModel({
  store: offerGroupsStore,
  adapt: (item) => new OfferGroupAdapter(item)
});

// NOTE: models список (массив) с моделями CollectionModel
const models = [pointsModel, destinationsModel, offerGroupsModel];

const newPointButtonView = document.querySelector('.trip-main__event-add-btn');
const filterView = document.querySelector(String(FilterView));
const sortView = document.querySelector(String(SortView));
const listView = document.querySelector(String(ListView));
const emptyListView = document.querySelector('.trip-events__msg');
const newPointEditorView = new NewPointEditorView(listView);
const pointEditorView = new PointEditorView(listView);

Promise.all(
  models.map((model) => model.ready())
)
  .then(() => {
    new NewPointButtonPresenter(newPointButtonView, models);
    new FilterPresenter(filterView, models);
    new SortPresenter(sortView, models);
    new ListPresenter(listView, models);
    new EmptyListPresenter(emptyListView, models);
    new NewPointEditorPresenter(newPointEditorView, models);
    new PointEditorPresenter(pointEditorView, models);
  })

  .catch((exception) => {
    emptyListView.textContent = exception;
  });
