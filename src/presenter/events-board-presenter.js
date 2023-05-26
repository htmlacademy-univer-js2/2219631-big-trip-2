import EventListView from '../view/event-list-view';
import SortView from '../view/sort-view';
import { render} from '../framework/render';
import NoEventView from '../view/event-empty';
import { filters } from '../utils/filter';
import EventPresenter from './event-presenter';
import { updateItem } from '../utils/common';
import { SortType, sortEventsByType } from '../utils/common';


export default class EventBoardPresenter{
  #tripEventsModel;
  #tripEvents;
  #offersModel;
  #offersByType;
  #tripEventsComponent;
  #tripEventsList;
  #filterType;
  #tripEventsPresenters;
  #sortComponent = new SortView();
  #currentSortType = SortType.DAY;
  #sourcedBoardEvents;

  constructor(tripEventsComponent, tripEventsModel, offersModel) {
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvents = [...this.#tripEventsModel.tripEvents];

    this.#offersModel = offersModel;
    this.#offersByType = [...this.#offersModel.offersByType];

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new EventListView();

    this.#tripEventsPresenters = new Map();

    this.#filterType = filters.EVERYTHING;
    this.#sourcedBoardEvents = [...this.#tripEventsModel.tripEvents];
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    if(this.#tripEvents.length === 0){
      this.#renderNoEventsMessage();
      return;
    }

    this.#renderSort();
    this.#renderTripEventsList();
  }

  #renderNoEventsMessage() {
    render(new NoEventView(this.#filterType), this.#tripEventsComponent);
  }

  #handleSortTypeChange = (sortType) => {
    if(sortType === this.#currentSortType) {
      return;
    }
    sortEventsByType[sortType](this.#tripEvents);
    this.#currentSortType = sortType;
    this.#clearEventsList();
    this.#renderTripEvents();
  };

  #renderSort() {
    //render(new SortView(), this.#tripEventsComponent);
    render(this.#sortComponent, this.#tripEventsComponent);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderTripEventsList() {
    render(this.#tripEventsList, this.#tripEventsComponent);
    sortEventsByType[this.#currentSortType](this.#tripEvents);
    this.#renderTripEvents();
  }

  #renderTripEvents() {
    for(let i = 0; i < this.#tripEvents.length; i++) {
      this.#renderTripEvent(this.#tripEvents[i]);
    }
  }

  #onTripEventChange = (updatedItem) => {
    this.#tripEvents = updateItem(this.#tripEvents, updatedItem);
    this.#sourcedBoardEvents = updateItem(this.#sourcedBoardEvents, updatedItem);
    this.#tripEventsPresenters.get(updatedItem.id).init(updatedItem);
  };

  #onTripEventModeChange = () => {
    this.#tripEventsPresenters.forEach((tripEvent) => tripEvent.resetTripEventMode());
  };

  #renderTripEvent(tripEvent) {
    const tripEventPresenter = new EventPresenter(this.#tripEventsList.element, this.#offersByType, this.#onTripEventChange, this.#onTripEventModeChange);
    tripEventPresenter.init(tripEvent);
    this.#tripEventsPresenters.set(tripEvent.id, tripEventPresenter);
  }

  #clearEventsList = () => {
    this.#tripEventsPresenters.forEach((e)=>e.destroy());
    this.#tripEventsPresenters.clear();
  };
}
