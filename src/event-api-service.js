import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class EventsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  updatePoint = async (point) => {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };


  #adaptToServer = (event) => {
    const adaptedEvent = {...event,
      'base_price': event.base_price,
      'date_from': event.date_from,
      'date_to': event.date_to,
      'is_favorite': event.isFavorite,
    };

    // Ненужные ключи мы удаляем
    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  };
}
