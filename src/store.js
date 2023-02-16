// NOTE: Сервер, запрос, ответ, работа

/**
 * Объявлеяем дженерик (шаблонный тип данных) - Item
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

  /**
   * @return {Promise<Item[]>}
   */
  list() {
    return this.request('/', {
      method: 'get'
    });
  }

  /**
   * @param {Omit<Item, 'id'>} item
   * @return {Promise<Item>}
   */
  add(item) {
    return this.request('/', {
      method: 'post',
      body: JSON.stringify(item)
    });
  }

  /**
   * @param {Item} item
   * @return {Promise<Item>}
   */
  update(item) {
    // @ts-ignore
    return this.request(`/${item.id}`, {
      method: 'put',
      body: JSON.stringify(item)
    });
  }

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
  // NOTE: options = {} аргумент не обязательный, поэтому присваеваем пустой объект
  async request(path, options = {}) {
    // NOTE: headers - объект с заголовками которые будем передавать на сервер.
    const headers = {
      'content-type': 'application/json',
      'authorization': this.#auth,
      // NOTE: в объект ...options подмешиваем свайства объекта headers
      ...options.headers,
    };

    // NOTE: ответ с сервера
    const response = await fetch(this.#base + path, {...options, headers});
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

      throw new Error(message, {
        cause: await response.json()
      });
    }
  }

  /**
   * @param {Response} response
   */
  static parse(response) {
    if (response.headers.get('content-type').startsWith('application/json')) {
      return response.json();
    }

    return response.text();
  }
}
