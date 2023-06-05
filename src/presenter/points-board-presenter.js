import PointsListView from '../view/points-list-view';
import SortView from '../view/sort-view';
import LoadingView from '../view/loading-view';
import EmptyPointsList from '../view/empty-points-list-view';
import { render, remove} from '../framework/render';
import { filter } from '../utils/filter';
import PointPresenter from './point-presenter';
import PointNewPresenter from './point-new-presenter';
import { sortPointsByType } from '../utils/sort';
import { UserAction, UpdateType, FilterTypes, SortType } from '../const';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class PointsBoardPresenter{
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
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(pointsComponent, pointsModel, offersByTypeModel, destinationModel, filterModel) {
    this.#pointsModel = pointsModel;
    this.#offersByTypeModel = offersByTypeModel;
    this.#destinationModel = destinationModel;
    this.#filterModel = filterModel;

    this.#pointsComponent = pointsComponent;
    this.#pointsList = new PointsListView();

    this.#pointPresenter = new Map();
    this.#pointNewPresenter = new PointNewPresenter(this.#pointsList.element, this.#offersByTypeModel.offersByType,
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
    return sortPointsByType[this.#currentSortType](filteredPoints);
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
    const pointPresenter = new PointPresenter(this.#pointsList.element, this.#offersByTypeModel.offersByType,this.#destinationModel.destinations ,this.#handleViewAction, this.#onPointModeChange);
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

  #handleViewAction = async (userActionType, updateType, update) => {
    this.#uiBlocker.block();
    switch(userActionType) {
      case UserAction.ADD_POINT:
        //this.#pointPresenter.setSaving();
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#pointNewPresenter = new PointNewPresenter(this.#pointsList.element, this.#offersByTypeModel.offersByType,
          this.#destinationModel.destinations, this.#handleViewAction);
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

  #onPointModeChange = () => {
    this.#pointPresenter.forEach((point) => point.resetPointMode());
  };
}
