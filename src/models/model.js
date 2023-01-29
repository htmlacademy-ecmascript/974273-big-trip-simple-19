// NOTE: Базовая модель
// NOTE: EventTarget-наследуем интерфейс

export default class Model extends EventTarget {
  /**
 * @abstract
 */
  async ready() { }
}
