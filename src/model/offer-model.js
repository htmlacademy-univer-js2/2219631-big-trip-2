import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class OfferByTypeModel extends Observable{
  #tripEventsApiService = null;
  #offers = [];
  constructor(tripEventsApiService){
    super();
    this.#tripEventsApiService = tripEventsApiService;
  }

  init = async () => {
    try{
      this.#offers = await this.#tripEventsApiService.offers;
    } catch (err) {
      this.offers = [];
    }
    this._notify(UpdateType.INIT);
  }

  get offers(){
    return this.#offers;
  }
}
