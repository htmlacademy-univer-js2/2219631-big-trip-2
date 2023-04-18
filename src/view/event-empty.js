import AbstractView from '../framework/view/abstract-view';

const messages = {
  'everything': 'Click New Event to create your first point',
  'future': 'There are no future events now',
  'past': 'There are no past events now',
};

const createNoEventViewTemplate = (filter) => `<p class="trip-events__msg">${messages[filter]}</p>`;


export default class NoEventView extends AbstractView{
    #filter;
    constructor(filter){
      super();
      this.#filter = filter;
    }

    get template() {
      return createNoEventViewTemplate(this.#filter);
    }
}
