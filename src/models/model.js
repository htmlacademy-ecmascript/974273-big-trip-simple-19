// NOTE: Model - класс который берёт интерфейс EventTarget
// NOTE: EventTarget - интерфейс реализуется объектами, которые могут получать события и могут иметь для них прослушиватели.

export default class Model extends EventTarget {
  /**
   * @abstract
   */
  // NOTE: ready() - сигнализирует что модель готова к взаимодействию.
  async ready() { }
}
