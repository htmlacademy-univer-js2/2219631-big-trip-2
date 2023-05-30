import { types, getRandomInteger} from '../utils/common';
import { generateDate } from '../utils/event-date';
import { generateTripEvent } from '../mock/event';

export default class TripEventsModel{
  #events;

  constructor(eventsCount, offersByType, destinations) {
    this.#events = Array.from({length: eventsCount},
      (event, id) => {
        const type1 = types[getRandomInteger(0, types.length - 1)];
        return generateTripEvent(id, type1, offersByType.length ? offersByType.find((offer) => offer.type === type1).offers : [], destinations[id], generateDate());
      });
  }

  get tripEvents() {
    return this.#events;
  }
}
