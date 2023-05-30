import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeEventTime } from '../utils/event-date.js';
import { uppperFirstSymbol, shuffle, getRandomInteger, types } from '../utils/common.js';
import { destinationDescriptions, destinationPlaces } from '../utils/destination.js';


const destinationMaxSentences = 5;

const destinationMaxPhotoIndex = 100;
const destinationMaxPhotoCount = 5;


const createEventDestinationTemplate = (event) => {
  if(event.destination.description.length || event.destination.pictures.length) {
    const pictures = event.destination.pictures.map((picture) =>
      `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');
    return(
      `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${event.destination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures}
      </div>
    </div>
  </section>`
    );
  }
  return '<section class="event__section  event__section--destination"></section>';
};

const createEventOffersTemplate = (event, offersByType) => {
  const {offers} = event;

  if(offersByType.length) {
    const eventOffersByType = offersByType.map((offer) => {
      const checked = offers.includes(offer.id) ? 'checked' : '';

      const titleClass = offer.title.toLowerCase().replace(' ', '-');

      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${titleClass}-1" data-offer-title="${offer.title}" type="checkbox" name="event-offer-${titleClass}" ${checked}>
          <label class="event__offer-label" for="event-offer-${titleClass}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
      );
    }).join('');

    return(
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${eventOffersByType}
        </div>
      </section>`
    );
  }
  return '<section class="event__section  event__section--offers"></section>';
};

const createEventType = (currentType) => (
  Array.from(types, (eventType) => {
    const isChecked = eventType === currentType ? 'checked' : '';
    return (`<div class="event__type-item">
                  <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked}>
                  <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${uppperFirstSymbol(eventType)}</label>
                </div>`);
  }).join('')
);
const createEventEditTemplate = (event, offersByType) => {
  const {basePrice, dateFrom, dateTo, destination, type} = event;
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventType(type)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${uppperFirstSymbol(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
            ${Array.from(destinationPlaces, (place) => `<option value="${place}"></option>`).join('')}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeEventTime(dateFrom, 'DD/MM/YY HH:mm')}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeEventTime(dateTo, 'DD/MM/YY HH:mm')}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
        ${createEventOffersTemplate(event, offersByType)}
        ${createEventDestinationTemplate(event)}
        </section>
      </form>
    </li>`
  );
};
export default class EventEditView extends AbstractStatefulView {
  #offersByType;
  #offersByCurrentType;
  constructor (event, offersByType) {
    super();
    this._state = EventEditView.parseEventToState(event);
    this.#offersByType = offersByType;
    this.#offersByCurrentType = this.#offersByType.length ? this.#offersByType.find((offer) => offer.type === event.type).offers : [];
    this.#setInnerHandlers();
  }

  get template()
  {
    return createEventEditTemplate(this._state, this.#offersByCurrentType);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseClickHandler(this._callback.formCloseClick);
  };

  static parseEventToState = (event) => ({...event});

  static parseStateToEvent = (state) => ({...state});

  #onPriceInput = (event) => {
    event.preventDefault();

    this._setState({
      basePrice: event.target.value,
    });
  };

  #onOfferClick = (event) => {
    if(event.target.tagName !== 'INPUT') {
      return;
    }

    event.preventDefault();

    const newOffer = this.#offersByCurrentType.find((offer) => offer.title === event.target.dataset.offerTitle).id;

    if(this._state.offers.includes(newOffer)) {
      this._state.offers.splice(this._state.offers.indexOf(newOffer), 1);
    } else {
      this._state.offers.push(newOffer);
    }

    this.updateElement({
      offers: this._state.offers,
    });
  };

  #updateOffersByCurrentType(newType) {
    this.#offersByCurrentType = this.#offersByType.length ? this.#offersByType.find((offer) => offer.type === newType).offers : [];
  }

  #onEventTypeClick = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    this.#updateOffersByCurrentType(evt.target.value);

    this.updateElement({
      type: evt.target.value,
      offers: this.#offersByCurrentType.length ? shuffle(Array.from(this.#offersByCurrentType, (offer) => offer.id)).slice(0, getRandomInteger(1, this.#offersByCurrentType.length)) : [],
    });
  };

  #onEventPlaceChange = (event) => {
    event.preventDefault();

    this.updateElement({
      destination: {...this._state.destination,
        description: shuffle(destinationDescriptions).slice(0, getRandomInteger(0, destinationMaxSentences)).join(' '),
        name: event.target.value,
        pictures: Array.from({length: getRandomInteger(0, destinationMaxPhotoCount)}, () => (
          {
            src: `http://picsum.photos/248/152?r=${getRandomInteger(1, destinationMaxPhotoIndex)}`,
            description: destinationDescriptions[getRandomInteger(0, destinationDescriptions.length - 1)],
          }
        )),
      }
    });
  };

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmit);
  }

  setFormCloseClickHandler(callback) {
    this._callback.formCloseClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onFormCloseClick);
  }

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(this._state);
  }

  #onFormCloseClick = (evt) => {
    evt.preventDefault();
    this._callback.formCloseClick();
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('click', this.#onEventTypeClick);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#onEventPlaceChange);
    if(this.#offersByType.length && this.#offersByCurrentType.length) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#onOfferClick);
    }
    this.element.querySelector('#event-price-1').addEventListener('input', this.#onPriceInput);
  };

  reset(event) {
    this.#updateOffersByCurrentType(event.type);

    this.updateElement({
      offers: event.offers,
    });

    this.updateElement(EventEditView.parseEventToState(event));
  }
}
