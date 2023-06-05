import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class TripEventsModel extends Observable{
  #tripEventsApiService = null;
  #tripEvents = [];
  constructor(tripEventsApiService) {
    super();
    this.#tripEventsApiService = tripEventsApiService;
  }

  init = async () => {
    try {
      const events = await this.#tripEventsApiService.points;
      this.#tripEvents = events.map(this.#adaptToClient);
    } catch(err) {
      this.#tripEvents = [];
    }
    this._notify(UpdateType.INIT);
  };

  get tripEvents() {
    return this.#tripEvents;
  }

  addTripEvent = (updateType, updatedItem) => {
    this.#tripEvents = [updatedItem, ...this.#tripEvents];

    this._notify(updateType, updatedItem);
  };

  updateTripEvent = async (updateType, updatedItem) => {
    const updatedItemIndex = this.#tripEvents.findIndex((item) => item.id === updatedItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t update unexisting trip event');
    }

    try {
      const response = await this.#tripEventsApiService.updatePoint(updatedItem);
      const updatedTripEvent = this.#adaptToClient(response);
      this.#tripEvents = [...this.#tripEvents.slice(0, updatedItemIndex), updatedTripEvent, ...this.#tripEvents.slice(updatedItemIndex + 1)];
      this._notify(updateType, updatedTripEvent);
    } catch(err) {
      throw new Error('Can\'t update trip event');
    }
    this._notify(updateType, this.updateTripEvent);
  };

  deleteTripEvent = (updateType, updatedItem) => {
    const updatedItemIndex = this.#tripEvents.findIndex((item) => item.id === updatedItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t delete unexisting trip event');
    }

    this.#tripEvents = [...this.#tripEvents.slice(0, updatedItemIndex), ...this.#tripEvents.slice(updatedItemIndex + 1)];

    this._notify(updateType);
  };

  #adaptToClient(event) {
    const adaptedTripEvent = {...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'],
      dateTo: event['date_to'],
      isFavorite: event['is_favorite'],
    };

    delete adaptedTripEvent['base_price'];
    delete adaptedTripEvent['date_from'];
    delete adaptedTripEvent['date_to'];
    delete adaptedTripEvent['is_favorite'];

    return adaptedTripEvent;
  }
}
