import Adapter from './adapter';

export default class OfferGroupAdapter extends Adapter {
  /**
   * @param {OfferGroup} data
   */
  constructor (data) {
    super();

    this.id = data.type;
    // NOTE: this.items создаем новый массив объектов
    // NOTE: this.items через ...item копируем все значения и свойства объекта
    // NOTE: this.items id: - перезаписываем в формат строки через метод String()
    this.items = data.offers?.map((item) => ({
      ...item,
      id: String(item.id)
    }));
  }
}
