import { createElement } from "../render";

const messages = {
    'everything': 'Click New Event to create your first point',
    'future': 'There are no future events now',
    'past': 'There are no past events now',
}

const createNoEventViewTemplate = (filter) => `<p class="trip-events__msg">${messages[filter]}</p>`;


export default class NoEventView {
    #element;
    #filter;    
    constructor(filter){
        this.#element = null;
        this.#filter = filter;
    }

    get template() {
        return createNoEventViewTemplate(this.#filter);
    }
    
    get element() {
      if (!this.#element) {
        this.#element = createElement(this.template);
      }
  
      return this.#element;
    }
  
    removeElement() {
      this.#element = null;
    }
  }