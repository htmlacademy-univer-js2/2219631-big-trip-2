import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class TripEventDestinationModel extends Observable{
  #tripEventsApiService = null;
  #destinations = [];

  constructor(tripEventsApiService) {
    super();
    this.#tripEventsApiService = tripEventsApiService;
  }

  init = async () => {
    try{
      this.#destinations = await this.#tripEventsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT);
  }

  get destinations(){
    return this.#destinations;
  }
}
