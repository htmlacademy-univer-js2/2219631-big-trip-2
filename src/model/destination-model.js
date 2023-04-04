import { generateEventDestination } from '../mock/event-destination';

export default class TripEventDestinationModel{
  constructor(eventsCount) {
    this.destinations = Array.from({length: eventsCount}, (destination, id) => generateEventDestination(id));
  }

  getDestinations(){
    return this.destinations;
  }
}
