import PointsListView from '../view/points-list-view';
import SortView from '../view/sort-view';
import LoadingView from '../view/loading-view';
import EmptyPointsList from '../view/empty-points-list-view';
import { render, remove} from '../framework/render';
import { filter } from '../utils/filter';
import EventPresenter from './event-presenter';
import EventNewPresenter from './event-new-presenter';
import { sortEventsByType } from '../utils/sort';
import { UserAction, UpdateType, FilterTypes, SortType } from '../const';


export default class EventBoardPresenter{
  #pointsModel;
  #offersByTypeModel;
  #destinationModel;
  #filterModel;

  #pointsComponent;
  #pointsList;
  #noPointsMessage = null;

  #pointPresenter;
  #pointNewPresenter;

  #sortComponent;
  #currentSortType = SortType.DAY;

  #loadingComponent = new LoadingView();
  #isLoading = true;

  constructor(pointsComponent, pointsModel, offersByTypeModel, destinationModel, filterModel) {
    this.#pointsModel = pointsModel;
    this.#offersByTypeModel = offersByTypeModel;
    this.#destinationModel = destinationModel;
    this.#filterModel = filterModel;

    this.#pointsComponent = pointsComponent;
    this.#pointsList = new PointsListView();

    this.#pointPresenter = new Map();
    this.#pointNewPresenter = new EventNewPresenter(this.#pointsList.element, this.#offersByTypeModel.offersByType,
      this.#destinationModel.destinations, this.#handleViewAction);

    this.#sortComponent = null;
    this.#currentSortType = SortType.DAY;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersByTypeModel.addObserver(this.#handleModelEvent);
    this.#destinationModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get points() {
    const filteredPoints = filter[this.#filterModel.filterType]([...this.#pointsModel.points]);
    return sortEventsByType[this.#currentSortType](filteredPoints);
  }

  createPoint(destroyCallback) {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilterType(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#pointNewPresenter.init(destroyCallback);
  }

  #renderBoard() {
    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if(!this.points.length){
      this.#renderNoPointsMessage();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }

  #renderNoPointsMessage() {
    this.#noPointsMessage = new EmptyPointsList(this.#filterModel.filterType);
    render(this.#noPointsMessage, this.#pointsComponent);
  }

  #renderSort() {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#pointsComponent);
  }

  #renderPointsList() {
    render(this.#pointsList, this.#pointsComponent);
    this.#renderPoints();
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new EventPresenter(this.#pointsList.element, this.#offersByTypeModel.offersByType,this.#destinationModel.destinations ,this.#handleViewAction, this.#onPointModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#pointsComponent);
  }

  #clearBoard(sortType) {
    this.#pointNewPresenter.destroy();

    this.#pointPresenter.forEach((point) => point.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#noPointsMessage);

    if(this.#noPointsMessage) {
      remove(this.#noPointsMessage);
    }

    this.#currentSortType = sortType;
  }

  #handleViewAction = (userActionType, updateType, updatedItem) => {
    switch(userActionType) {
      case UserAction.ADD_POINT:
        this.#pointsModel.addPont(updateType, updatedItem);
        break;
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, updatedItem);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, updatedItem);
        break;
    }
  };

  #handleModelEvent = (updateType, updatedItem) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(updatedItem.id).init(updatedItem);
        break;
      case UpdateType.MINOR:
        this.#clearBoard(this.#currentSortType);
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(SortType.DAY);
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        if(this.#pointsModel.points.length && this.#offersByTypeModel.offersByType.length && this.#destinationModel.destinations.length){
          this.#isLoading = false;
          remove(this.#loadingComponent);
          this.#renderBoard();}
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

  #onPointModeChange = () => {
    this.#pointPresenter.forEach((point) => point.resetPointMode());
  };
}
