import EventListView from '../view/event-list-view';
import SortView from '../view/sort-view';
import { render} from '../framework/render';
import NoEventView from '../view/event-empty';
import { filters } from '../utils/filter';
import EventPresenter from './event-presenter';
import { updateItem } from '../utils/common';
import { SortType, sortEventsByType } from '../utils/common';


export default class EventBoardPresenter{
  #eventsModel;
  #events;
  #offersModel;
  #offersByType;
  #eventsComponent;
  #eventsList;
  #filterType;
  #eventPresenter;
  #sortComponent = new SortView();
  #currentSortType = SortType.DAY;
  #sourcedBoardEvents;

  constructor(eventsComponent, eventsModel, offersModel) {
    this.#eventsModel = eventsModel;
    this.#events = [...this.#eventsModel.tripEvents];

    this.#offersModel = offersModel;
    this.#offersByType = [...this.#offersModel.offersByType];

    this.#eventsComponent = eventsComponent;
    this.#eventsList = new EventListView();

    this.#eventPresenter = new Map();

    this.#filterType = filters.EVERYTHING;
    this.#sourcedBoardEvents = [...this.#eventsModel.tripEvents];
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    if(this.#events.length === 0){
      this.#renderNoEventsMessage();
      return;
    }

    this.#renderSort();
    this.#renderEventsList();
  }

  #renderNoEventsMessage() {
    render(new NoEventView(this.#filterType), this.#eventsComponent);
  }

  #handleSortTypeChange = (sortType) => {
    if(sortType === this.#currentSortType) {
      return;
    }
    sortEventsByType[sortType](this.#events);
    this.#currentSortType = sortType;
    this.#clearEventsList();
    this.#renderEvents();
  };

  #renderSort() {
    //render(new SortView(), this.#tripEventsComponent);
    render(this.#sortComponent, this.#eventsComponent);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderEventsList() {
    render(this.#eventsList, this.#eventsComponent);
    sortEventsByType[this.#currentSortType](this.#events);
    this.#renderEvents();
  }

  #renderEvents() {
    for(let i = 0; i < this.#events.length; i++) {
      this.#renderEvent(this.#events[i]);
    }
  }

  #onEventChange = (updatedItem) => {
    this.#events = updateItem(this.#events, updatedItem);
    this.#sourcedBoardEvents = updateItem(this.#sourcedBoardEvents, updatedItem);
    this.#eventPresenter.get(updatedItem.id).init(updatedItem);
  };

  #onEventModeChange = () => {
    this.#eventPresenter.forEach((tripEvent) => tripEvent.resetTripEventMode());
  };

  #renderEvent(event) {
    const eventPresenter = new EventPresenter(this.#eventsList.element, this.#offersByType, this.#onEventChange, this.#onEventModeChange);
    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  }

  #clearEventsList = () => {
    this.#eventPresenter.forEach((e)=>e.destroy());
    this.#eventPresenter.clear();
  };
}
