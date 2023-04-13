import { generateEventDestination } from '../mock/event-destination';

export default class TripEventDestinationModel{
  #destinations;

  constructor(eventsCount) {
    this.#destinations = Array.from({length: eventsCount}, (destination, id) => generateEventDestination(id));
  }

  get destinations(){
    return this.#destinations;
  }
}
