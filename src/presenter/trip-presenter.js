import EventView from '../view/event-view';
import EventListView from '../view/event-list-view';
import EventEditView from '../view/event-edit-view';
import SortView from '../view/sort-view';
import EventOffersView from '../view/event-offers-view';
import EventDestinationView from '../view/event-destination-view';
import EventAddView from '../view/event-add-view';
import { render } from '../render';
import { isEscapePushed } from '../utils';


export default class TripPresenter{
  #tripEventsModel;
  #tripEvents;
  #offersModel;
  #offersByType;
  #tripEventsComponent;
  #tripEventsList;
  #newTripEvent;

  constructor(tripEventsComponent, tripEventsModel, offersModel){
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvents = [...this.#tripEventsModel.tripEvents];

    this.#offersModel = offersModel;
    this.#offersByType = [...this.#offersModel.offersByType];

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new EventListView();

    this.#newTripEvent = new EventAddView(this.#tripEvents[0]);
  }

  #renderTripEventForm(editForm){
    render(editForm, this.#tripEventsList.element);
    render(new EventOffersView(editForm.tripEvent, this.#offersByType), editForm.element.querySelector('.event__details'));
    render(new EventDestinationView(editForm.tripEvent), editForm.element.querySelector('.event__details'));
  }

  #renderTripEvent(tripEvent) {
    const newEvent = new EventView(tripEvent, this.#offersByType);
    const tripEventEditForm = new EventEditView(tripEvent);

    const eventDetailsComponent = tripEventEditForm.element.querySelector('.event__details');
    const offersComponent = new EventOffersView(tripEventEditForm.tripEvent, this.#offersByType);
    const destination = new EventDestinationView(tripEventEditForm.tripEvent);

    eventDetailsComponent.appendChild(offersComponent.element);
    eventDetailsComponent.appendChild(destination.element);

    const replaceEventListChildren = (newChild, oldChild) => {
      this.#tripEventsList.element.replaceChild(newChild, oldChild);
    };

    const onEscapeKeyDown = (evt) => {
      if(isEscapePushed(evt)){
        evt.preventDefault();
        replaceEventListChildren(newEvent.element, tripEventEditForm.element);
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    const onFormOpenButtonClick = () => {
      replaceEventListChildren(tripEventEditForm.element, newEvent.element);
      document.addEventListener('keydown', onEscapeKeyDown);
    };

    const onFormCloseButtonClick = () => {
      replaceEventListChildren(newEvent.element, tripEventEditForm.element);
      document.removeEventListener('keydown', onEscapeKeyDown);
    };

    const onEditFormSubmit = (evt) => {
      evt.preventDefault();
      onFormCloseButtonClick();
    };

    newEvent.element.querySelector('.event__rollup-btn').addEventListener('click', onFormOpenButtonClick);

    tripEventEditForm.element.addEventListener('submit', onEditFormSubmit);

    tripEventEditForm.element.querySelector('.event__rollup-btn').addEventListener('click', onFormCloseButtonClick);

    render(newEvent, this.#tripEventsList.element);
  }

  init() {
    render(new SortView(), this.#tripEventsComponent);
    render(this.#tripEventsList, this.#tripEventsComponent);

    this.#renderTripEventForm(this.#newTripEvent);

    for(let i = 2; i < this.#tripEvents.length; i++) {
      this.#renderTripEvent(this.#tripEvents[i]);
    }
  }
}
