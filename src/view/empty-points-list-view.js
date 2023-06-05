import AbstractView from '../framework/view/abstract-view';
import { FilterTypes } from '../const';

const MessagesByFilterType = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PAST]: 'There are no past events now',
};

const createEmptyPointsListTemplate = (filterType) => `<p class="trip-events__msg">${MessagesByFilterType[filterType]}</p>`;


export default class EmptyPointsList extends AbstractView {
  #filterType;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPointsListTemplate(this.#filterType);
  }
}
