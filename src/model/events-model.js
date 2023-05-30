import { types, getRandomInteger} from '../utils/common';
import { generateDate } from '../utils/event-date';
import { generateTripEvent } from '../mock/event';

export default class TripEventsModel{
  #tripEvents;

  constructor(eventsCount, offersByType, destinations) {
    this.#tripEvents = Array.from({length: eventsCount},
      (tripEvent, id) => {
        const type1 = types[getRandomInteger(0, types.length - 1)];
        return generateTripEvent(id, type1, offersByType.length ? offersByType.find((offer) => offer.type === type1).offers : [], destinations[id], generateDate());
      });
  }

  get tripEvents() {
    return this.#tripEvents;
  }
}
