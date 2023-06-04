import { types, getRandomInteger} from '../utils/common';
import { generateDate } from '../utils/event-date';
import { generateTripEvent } from '../mock/event';
import Observable from '../framework/observable';

export default class TripEventsModel extends Observable{
  #tripEvents;

  constructor(eventsCount, offersByType, destinations) {
    super();
    this.#tripEvents = Array.from({length: eventsCount},
      (tripEvent, id) => {
        const type = types[getRandomInteger(0, types.length - 1)];
        return generateTripEvent(type, offersByType.length ? offersByType.find((offer) => offer.type === type).offers : [], destinations[id], generateDate());
      });
  }

  get tripEvents() {
    return this.#tripEvents;
  }

  addTripEvent = (updateType, updatedItem) => {
    this.#tripEvents = [updatedItem, ...this.#tripEvents];

    this._notify(updateType, updatedItem);
  };

  updateTripEvent = (updateType, updatedItem) => {
    const updatedItemIndex = this.#tripEvents.findIndex((item) => item.id === updatedItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t update unexisting trip event');
    }

    this.#tripEvents = [...this.#tripEvents.slice(0, updatedItemIndex), updatedItem, ...this.#tripEvents.slice(updatedItemIndex + 1)];

    this._notify(updateType, updatedItem);
  };

  deleteTripEvent = (updateType, updatedItem) => {
    const updatedItemIndex = this.#tripEvents.findIndex((item) => item.id === updatedItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t delete unexisting trip event');
    }

    this.#tripEvents = [...this.#tripEvents.slice(0, updatedItemIndex), ...this.#tripEvents.slice(updatedItemIndex + 1)];

    this._notify(updateType);
  };
}
