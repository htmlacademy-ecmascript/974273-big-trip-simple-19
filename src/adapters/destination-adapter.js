import Adapter from './adapter';

export default class DestinationAdapter extends Adapter {
  /**
   * @param {Destination} data
   */
  constructor (data) {
    super();

    this.id = String(data.id);
    this.description = data.description;
    this.name = data.name;
    // NOTE: this.pictures новый список объектов
    // NOTE: this.pictures тем самым исключаем ситуацию, что где-то кто-то случайно перезапишет объект.
    this.pictures = data.pictures.map((item) => ({...item}));
  }
}
