// NOTE: Сервер, запрос, ответ, работа

/**
 * Объявляем дженерик (шаблонный тип данных) - Item
 * Item - список объектов
 * @template Item
 */
export default class Store {
  #base;
  #auth;

  /**
   *@param {string} base
   *@param {string} auth
   */
  constructor (base, auth) {
    this.#base = base;
    this.#auth = auth;
  }

  // NOTE: list() сервер, список точек маршрута
  /**
   * @return {Promise<Item[]>}
   */
  list() {
    return this.request('/', {
      method: 'get'
    });
  }

  // NOTE: add() сервер, добавление точки маршрута
  /**
   * @param {Omit<Item, 'id'>} item
   * @return {Promise<Item>}
   */
  add(item) {
    // NOTE: item - объект
    return this.request('/', {
      method: 'post',
      body: JSON.stringify(item)
    });
  }

  // NOTE: update() сервер, обновление данных точки маршрута
  /**
   * @param {Item} item
   * @return {Promise<Item>}
   */
  update(item) {
    // NOTE: item - объект, точки маршрута
    // @ts-ignore
    return this.request(`/${item.id}`, {
      method: 'put',
      body: JSON.stringify(item)
    });
  }

  // NOTE: delete() сервер, удаление точки маршрута
  /**
   * @param {string} id
   * @return {Promise<string>}
   */
  delete(id) {
    return this.request(`/${id}`, {
      method: 'delete'
    });
  }

  // NOTE: Запрос на сервер
  /**
   * path - путь на сервер
   * @param {string} path
   * RequestInit - запрос инициализации
   * @param {RequestInit} options
   */
  // NOTE: options = {} аргумент не обязательный, поэтому присваиваем пустой объект
  async request(path, options = {}) {
    // NOTE: headers - объект с заголовками которые будем передавать на сервер.
    const headers = {
      'content-type': 'application/json',
      'authorization': this.#auth,
      // NOTE: в объект ...options подмешиваем свойства объекта headers
      ...options.headers,
    };

    // NOTE: сервер - response это запрос на сервер.
    const response = await fetch(this.#base + path, {...options, headers});
    // NOTE: {assert, parse} - деконструирование, получаем доступ к нашим статическим методам
    // NOTE: {assert, parse} - получаем доступ к служебным статическим методам
    const {assert, parse} = /** @type {typeof Store} */ (this.constructor);

    await assert(response);

    return parse(response);
  }

  // NOTE: ответ - проверка на ошибку
  /**
   * @param {Response} response
   */
  static async assert(response) {
    // NOTE: если response не ОК, выкидываем ошибку throw new Error...
    if (!response.ok) {
      // NOTE: message - текст ошибки
      const message = `${response.status} - ${response.statusText}`;

      // NOTE: Error - конструктор, который выбрасывает ошибку.
      throw new Error(message, {
        cause: await response.json()
      });
    }
  }

  // NOTE: parse() определяет формат ответа (json, text, html и т.д.)
  // NOTE: parse() - распарсить (разобрать)
  // NOTE: parse() - Метод для разборки этого запроса
  // NOTE: parse() - в каком-то случае нужно вывести в формате JSON, в каком-то просто в формате текста
  /**
   * @param {Response} response
   */
  static parse(response) {
    // NOTE: parse() - условие которое находит ключ с требуемым свойством
    // NOTE: parse() - метод .get() - находит ключ
    // NOTE: parse() - метод .startsWith() - проверяет на совпадение свойства этого ключа
    if (response.headers.get('content-type').startsWith('application/json')) {
      return response.json();
    }

    return response.text();
  }
}
