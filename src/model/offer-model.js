import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class OfferByTypeModel extends Observable{
  #pointsApiService = null;
  #offersByType = [];
  constructor(pointsApiService){
    super();
    this.#pointsApiService = pointsApiService;
  }

  init = async () => {
    try{
      this.#offersByType = await this.#pointsApiService.offers;
    } catch (err) {
      this.offers = [];
    }
    this._notify(UpdateType.INIT);
  }

  get offersByType(){
    return this.#offersByType;
  }
}
