// NOTE: PointAdapter приводит данные точки маршрута (объекта) к виду данных на компьютере и обратно к виду на сервере

import Adapter from './adapter';

export default class PointAdapter extends Adapter {
  /**
   * @param {Partial<Point>} data
   */
  constructor (data = {}) {
    super();

    // NOTE: PointAdapter приводим данные к виду который у нас на компе при приходе с сервера
    this.basePrice = data.base_price;
    this.startDate = data.date_from;
    this.endDate = data.date_to;
    this.destinationId = String(data.destination);
    this.id = data.id;
    // NOTE: offers с помощью map(String) проходимся по массиву чисел и преобразуем в массив строк.
    // NOTE: offers?.map(String)
    // NOTE: offer в map мы передаем аргументом функцию String для преобразования.
    this.offerIds = data.offers?.map(String);
    this.type = data.type;
  }

  get startDateAsNumber() {
    return Date.parse(this.startDate);
  }

  get endDateAsNumber() {
    return Date.parse(this.endDate);
  }

  // NOTE: PointAdapter toJSON() метод, приводим данные к виду для передаче на сервер
  // NOTE: PointAdapter toJSON() обратить внимание, идентификаторы (ключи) должны быть строковыми
  /**
   * @override
   * @return {Partial<Point>}
   */
  toJSON() {
    return {
      'base_price': this.basePrice,
      'date_from': this.startDate,
      'date_to': this.endDate,
      'destination': Number(this.destinationId),
      'id': this.id,
      'offers': this.offerIds?.map(Number),
      'type': this.type,
    };
  }
}
