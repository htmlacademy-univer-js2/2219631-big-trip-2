import EventListView from '../view/event-list-view';
import SortView from '../view/sort-view';
import { render, remove} from '../framework/render';
import EmptyTripEventsList from '../view/event-empty';
import { filter } from '../utils/filter';
import EventPresenter from './event-presenter';
import { sortEventsByType } from '../utils/common';
import { UserAction, UpdateType, FilterTypes, SortType } from '../const';
import EventNewPresenter from './event-new-presenter';


export default class EventBoardPresenter{
  #eventsModel;
  #offersModel;
  #destinationModel;
  #eventsComponent;
  #eventsList;
  #filterModel;
  #noEventsMessage = null;
  #eventPresenter;
  #eventNewPresenter;
  #sortComponent;
  #currentSortType = SortType.DAY;

  constructor(eventsComponent, eventsModel, offersModel, destinationModel, filterModel) {
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;
    this.#filterModel = filterModel;

    this.#eventsComponent = eventsComponent;
    this.#eventsList = new EventListView();

    this.#eventPresenter = new Map();
    this.#eventNewPresenter = new EventNewPresenter(this.#eventsList.element, this.#offersModel.offersByType,
      this.#destinationModel.destinations, this.#handleViewAction);

    this.#sortComponent = null;
    this.#currentSortType = SortType.DAY;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get tripEvents() {
    const filteredTripEvents = filter[this.#filterModel.filterType]([...this.#eventsModel.tripEvents]);
    return sortEventsByType[this.#currentSortType](filteredTripEvents);
  }

  createTripEvent(destroyCallback) {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilterType(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#eventNewPresenter.init(destroyCallback);
  }

  #renderBoard() {
    if(this.tripEvents.length === 0){
      this.#renderNoEventsMessage();
      return;
    }

    this.#renderSort();
    this.#renderEventsList();
  }

  #renderNoEventsMessage() {
    this.#noEventsMessage = new EmptyTripEventsList(this.#filterModel.filterType);
    render(this.#noEventsMessage, this.#eventsComponent);
  }

  #renderSort() {
    //render(new SortView(), this.#tripEventsComponent);
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#eventsComponent);
  }

  #renderEventsList() {
    render(this.#eventsList, this.#eventsComponent);
    this.#renderEvents();
  }

  #renderEvents() {
    this.tripEvents.forEach((tripEvent) => this.#renderEvent(tripEvent));
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter(this.#eventsList.element, this.#offersModel.offersByType, this.#handleViewAction, this.#onEventModeChange);
    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  }

  #clearBoard(sortType) {
    this.#eventNewPresenter.destroy();

    this.#eventPresenter.forEach((point) => point.destroy());
    this.#eventPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noEventsMessage);

    if(this.#noEventsMessage) {
      remove(this.#noEventsMessage);
    }

    this.#currentSortType = sortType;
  }

  #handleViewAction = (userActionType, updateType, updatedItem) => {
    switch(userActionType) {
      case UserAction.ADD_TRIP_EVENT:
        this.#eventsModel.addTripEvent(updateType, updatedItem);
        break;
      case UserAction.UPDATE_TRIP_EVENT:
        this.#eventsModel.updateTripEvent(updateType, updatedItem);
        break;
      case UserAction.DELETE_TRIP_EVENT:
        this.#eventsModel.deleteTripEvent(updateType, updatedItem);
        break;
    }
  };

  #handleModelEvent = (updateType, updatedItem) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#eventPresenter.get(updatedItem.id).init(updatedItem);
        break;
      case UpdateType.MINOR:
        this.#clearBoard(this.#currentSortType);
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(SortType.DAY);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if(sortType === this.#currentSortType) {
      return;
    }
    this.#clearBoard(sortType);
    this.#renderBoard();
  };

  #onEventModeChange = () => {
    this.#eventPresenter.forEach((tripEvent) => tripEvent.resetTripEventMode());
  };
}
