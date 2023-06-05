import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class PointsModel extends Observable{
  #pointsApiService = null;
  #points = [];
  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  };

  get points() {
    return this.#points;
  }

  addPoint = (updateType, updatedItem) => {
    this.#points = [updatedItem, ...this.#points];

    this._notify(updateType, updatedItem);
  };

  updatePoint = async (updateType, updatedItem) => {
    const updatedItemIndex = this.#points.findIndex((item) => item.id === updatedItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t update unexisting trip event');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(updatedItem);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [...this.#points.slice(0, updatedItemIndex), updatedPoint, ...this.#points.slice(updatedItemIndex + 1)];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update trip event');
    }
    this._notify(updateType, this.updatePoint);
  };

  deletePoint = (updateType, updatedItem) => {
    const updatedItemIndex = this.#points.findIndex((item) => item.id === updatedItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t delete unexisting trip event');
    }

    this.#points = [...this.#points.slice(0, updatedItemIndex), ...this.#points.slice(updatedItemIndex + 1)];

    this._notify(updateType);
  };

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
