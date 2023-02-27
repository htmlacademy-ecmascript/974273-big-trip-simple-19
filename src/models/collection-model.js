// NOTE: collection-model.js работа с коллекциями объектов
// NOTE: collection-model.js взаимодействие - сортировка, открытие, искать, фильтровать ...

import Model from './model';
/**
 * @template Item
 * @template {Adapter} ItemAdapter
 */
export default class CollectionModel extends Model {
  #store;
  #adapt;
  #filter;
  #sort;

  /**
   * @type {Item[]}
   */
  #items;

  /**
   * @param {Object} setup
   * @param {Store<Item>} setup.store
   * @param {AdaptCallback<Item,ItemAdapter>} setup.adapt
   * @param {FilterCallback<ItemAdapter>} [setup.filter]
   * @param {SortCallback<ItemAdapter>} [setup.sort]
   */
  constructor (setup) {
    super();

    this.#store = setup.store;
    this.#adapt = setup.adapt;
    this.#filter = setup.filter;
    this.#sort = setup.sort;
  }

  /**
   * @override
   */
  // NOTE: ready() - асинхронный метод который срабатывает по готовности и сохраняет данные с сервера в this.#items
  // NOTE: ready() В зависимости от очередности вызова в main.js происходит сохранение в this.#items коллекций: pointsStore, destinationsStore, offerGroupsStore.
  async ready() {
    // NOTE: list() метод из файла store.js
    this.#items = await this.#store.list();
  }

  /**
   * @param {FilterCallback<ItemAdapter>} filter
   */
  setFilter(filter, notify = true) {
    this.#filter = filter;
    if (notify) {
      this.dispatchEvent(new CompositionEvent('filter'));
    }
  }

  getFilter() {
    return this.#filter;
  }

  /**
   * @param {SortCallback<ItemAdapter>} sort
   */
  setSort(sort, notify = true) {
    this.#sort = sort;
    if (notify) {
      this.dispatchEvent(new CompositionEvent('sort'));
    }
  }

  getSort() {
    return this.#sort;
  }

  listAll() {
    return this.#items.map(this.#adapt);
  }

  list(
    filter = this.getFilter(),
    sort = this.getSort()
  ) {
    return this.listAll().filter(filter).sort(sort);
  }

  /**
   * @param {number} [index]
   */
  item(index) {
    if (arguments.length) {
      const item = this.#items[index];

      return item && this.#adapt(item);
    }

    return this.#adapt();
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  findBy(key, value) {
    return this.listAll().find((item) => item[key] === value);
  }

  /**
   * @param {string} id
   */
  findById(id) {
    return this.findBy('id', id);
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  findIndexBy(key, value) {
    return this.listAll().findIndex((item) => item[key] === value);
  }

  findIndexById(id) {
    return this.findIndexBy('id', id);
  }

  /**
   * @param {ItemAdapter} item
   */
  async add(item) {
    const newItem = await this.#store.add(item.toJSON());
    const detail = this.#adapt(newItem);

    this.#items.push(newItem);
    this.dispatchEvent(new CustomEvent('add', {detail}));

    return detail;
  }

  /**
   * @param {ItemAdapter} item
   */
  async update(item) {
    const newItem = await this.#store.update(item.toJSON());
    const index = this.findIndexById(item.id);
    const detail = {newItem: this.#adapt(newItem), oldItem: this.item(index)};

    this.#items.splice(index, 1, newItem);
    this.dispatchEvent(new CustomEvent('update', {detail}));

    return detail;
  }

  /**
   * @param {string} id
   */
  async delete(id) {
    await this.#store.delete(id);

    const index = this.findIndexById(id);
    const detail = this.item(index);

    this.#items.splice(index, 1);
    this.dispatchEvent(new CustomEvent('delete', {detail}));

    return detail;
  }
}

