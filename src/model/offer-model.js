import { generateOffersByType, generateOffer } from '../mock/offer.js';
import { shuffle, getRandomInteger } from '../utils/common.js';
import { TYPES, OFFER_TITLES } from '../const.js';
import Observable from '../framework/observable.js';


export default class OfferByTypeModel extends Observable{
  #offers;
  #offersByType;
  constructor(){
    super();
    this.#offers = Array.from(OFFER_TITLES, (title, id) => generateOffer(id, title));
    this.#offersByType = Array.from(TYPES, (type) => generateOffersByType(type, shuffle(this.offers).
      slice(0, getRandomInteger(1, this.offers.length))));
  }

  get offersByType() {
    return this.#offersByType;
  }

  get offers() {
    return this.#offers;
  }

  setOffersByType(updateType, offersByType) {
    this.#offersByType = offersByType;
    this._notify(updateType, offersByType);
  }

  setOffers(updateType, offers) {
    this.#offers = offers;
    this._notify(updateType, offers);
  }
}
