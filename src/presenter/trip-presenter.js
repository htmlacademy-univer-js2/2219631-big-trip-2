import EventView from '../view/event-view';
import EventListView from '../view/event-list-view';
import EventEditView from '../view/event-edit-view';
import SortView from '../view/sort-view';
import EventOffersView from '../view/event-offers-view';
import EventDestinationView from '../view/event-destination-view';
import EventAddView from '../view/event-add-view';
import { render } from '../render';
import { pointMode } from '../utils';


export default class TripPresenter{
  #tripEventsModel;
  #tripEvents;
  #offersModel;
  #offersByType;
  #tripEventsComponent;
  #tripEventsList;
  #eventForm;

  constructor(tripEventsComponent, tripEventsModel, offersModel){
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvents = [...this.#tripEventsModel.tripEvents];

    this.#offersModel = offersModel;
    this.#offersByType = [...this.#offersModel.offersByType];

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new EventListView();

    this.#eventForm = new Map();
  }

  #renderTripEvent(tripEvent) {
    const newEvent = new EventView(tripEvent, this.#offersByType);
    const eventEdit = new EventEditView(tripEvent);

    const eventDetails = eventEdit.element.querySelector('.event__details');
    const offers = new EventOffersView(eventEdit.tripEvent, this.#offersByType);
    const destination = new EventDestinationView(eventEdit.tripEvent);

    render(offers, eventDetails);
    render(destination, eventDetails);

    const replaceEventListChildren = (newChild, oldChild) => {
      this.#tripEventsList.element.replaceChild(newChild, oldChild);
    };

    const onEscapeKeyDown = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'Esc'){
        evt.preventDefault();
        if (newEvent.pointMode = pointMode.EDITING){
          replaceEventListChildren(newEvent.element, eventEdit.element);
        }
        newEvent.pointMode = pointMode.DEFAULT;
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    const closeAllForms = () => {
      for (const [point, eventForm] of this.#eventForm){
        if(point.pointMode === pointMode.EDITING){
          point.pointMode = pointMode.DEFAULT;
          replaceEventListChildren(point.element, eventForm.element);
        }
      }
    };

    const onFormOpenButtonClick = () => {
      closeAllForms();
      newEvent.pointMode = pointMode.EDITING;
      replaceEventListChildren(eventEdit.element, newEvent.element);
      document.addEventListener('keydown', onEscapeKeyDown);
    };

    const onFormCloseButtonClick = () => {
      if (newEvent.pointMode = pointMode.EDITING){
      replaceEventListChildren(newEvent.element, eventEdit.element);
      }
      newEvent.pointMode = pointMode.DEFAULT;
      document.removeEventListener('keydown', onEscapeKeyDown);
    };

    const onEditFormSubmit = (evt) => {
      evt.preventDefault();
      onFormCloseButtonClick();
    };

    newEvent.element.querySelector('.event__rollup-btn').addEventListener('click', onFormOpenButtonClick);
    eventEdit.element.addEventListener('submit', onEditFormSubmit);
    eventEdit.element.querySelector('.event__rollup-btn').addEventListener('click', onFormCloseButtonClick);
    this.#eventForm.set(newEvent, eventEdit);
    render(newEvent, this.#tripEventsList.element);
  }

  init() {
    render(new SortView(), this.#tripEventsComponent);
    render(this.#tripEventsList, this.#tripEventsComponent);

    for(let i = 0; i < this.#tripEvents.length; i++) {
      this.#renderTripEvent(this.#tripEvents[i]);
    }
  }
}
