import EventView from '../view/event-view';
import EventListView from '../view/event-list-view';
import EventEditView from '../view/event-edit-view';
import SortView from '../view/sort-view';
import EventOffersView from '../view/event-offers-view';
import EventDestinationView from '../view/event-destination-view';
import { render, replace } from '../framework/render';
import { pointMode } from '../utils/common';
import NoEventView from '../view/event-empty';
import { filters } from '../utils/filter';


export default class TripPresenter{
  #tripEventsModel;
  #tripEvents;
  #offersModel;
  #offersByType;
  #tripEventsComponent;
  #tripEventsList;
  #eventForm;
  #filters;

  constructor(tripEventsComponent, tripEventsModel, offersModel){
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvents = [...this.#tripEventsModel.tripEvents];

    this.#offersModel = offersModel;
    this.#offersByType = [...this.#offersModel.offersByType];

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new EventListView();

    this.#eventForm = new Map();
    this.#filters = filters.EVERYTHING;
  }

  #renderTripEvent(tripEvent) {
    const newEvent = new EventView(tripEvent, this.#offersByType);
    const eventEdit = new EventEditView(tripEvent);

    const eventDetails = eventEdit.element.querySelector('.event__details');
    const offers = new EventOffersView(eventEdit.tripEvent, this.#offersByType);
    const destination = new EventDestinationView(eventEdit.tripEvent);

    render(offers, eventDetails);
    render(destination, eventDetails);

    const onEscapeKeyDown = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'Esc'){
        evt.preventDefault();
        if (newEvent.pointMode === pointMode.EDITING){
          replace(newEvent, eventEdit);
        }
        newEvent.pointMode = pointMode.DEFAULT;
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    const closeAllForms = () => {
      for (const [point, eventForm] of this.#eventForm){
        if(point.pointMode === pointMode.EDITING){
          point.pointMode = pointMode.DEFAULT;
          replace(point, eventForm);
        }
      }
    };

    const onFormOpenButtonClick = () => {
      closeAllForms();
      newEvent.pointMode = pointMode.EDITING;
      replace(eventEdit, newEvent);
      document.addEventListener('keydown', onEscapeKeyDown);
    };

    const onFormCloseButtonClick = () => {
      if (newEvent.pointMode === pointMode.EDITING){
        replace(newEvent, eventEdit);
      }
      newEvent.pointMode = pointMode.DEFAULT;
      document.removeEventListener('keydown', onEscapeKeyDown);
    };

    newEvent.setFormOpenClickHandler(onFormOpenButtonClick);
    eventEdit.setFormSubmitHandler(onFormCloseButtonClick);
    eventEdit.setFormCloseClickHandler(onFormCloseButtonClick);
    this.#eventForm.set(newEvent, eventEdit);
    render(newEvent, this.#tripEventsList.element);
  }

  init() {
    if (this.#tripEvents.length === 0){
      render (new NoEventView(this.#filters), this.#tripEventsComponent);
      return;
    }

    render(new SortView(), this.#tripEventsComponent);
    render(this.#tripEventsList, this.#tripEventsComponent);

    for(let i = 0; i < this.#tripEvents.length; i++) {
      this.#renderTripEvent(this.#tripEvents[i]);
    }
  }
}
