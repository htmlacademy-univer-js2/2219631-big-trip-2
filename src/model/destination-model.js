import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class PointDestinationModel extends Observable{
  #pointsApiService = null;
  #destinations = [];

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  init = async () => {
    try{
      this.#destinations = await this.#pointsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
  }

  get destinations(){
    return this.#destinations;
  }
}
