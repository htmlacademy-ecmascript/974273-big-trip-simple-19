// NOTE: adapter - базовый адаптер (класс) для приведения данных к виду, который хочет сервер
export default class Adapter {
  constructor () {
    this.id = '';
  }

  toJSON() {
    return null;
  }
}
