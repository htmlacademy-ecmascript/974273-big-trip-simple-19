import Adapter from './adapter';

export default class OfferGroupAdapter extends Adapter {

  /**
   * @param {Partial<OfferGroup>} data
   */

  constructor (data = {}) {
    super();
    this.id = String(data.type);
    this.items = data.offers?.map(String);
  }
}
