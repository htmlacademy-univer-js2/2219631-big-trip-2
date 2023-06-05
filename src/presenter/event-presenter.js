import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';
import { render, replace, remove } from '../framework/render';
import { UserAction, UpdateType, PointMode } from '../const';
import { areDatesSame } from '../utils/event-date';

export default class EventPresenter{
    #pointComponent;
    #editFormComponent;
    #pointsListContainer;

    #point;
    #offersByType;
    #destinations;

    #changeData;
    #changePointMode;
    #pointMode;

    constructor(pointsListContainer, offersByType, destinations, changeData, changePointMode) {
      this.#pointsListContainer = pointsListContainer;
      this.#offersByType = offersByType;
      this.#destinations = destinations;

      this.#changeData = changeData;
      this.#changePointMode = changePointMode;

      this.#pointMode = PointMode.DEFAULT;

      this.#pointComponent = null;
      this.#editFormComponent = null;
    }

    init(event) {
      this.#point = event;
      this.#renderPointComponent();
    }

    resetPointMode() {
      if(this.#pointMode === PointMode.EDITING) {
        this.#replaceFormToPoint();
      }
    }

    destroy() {
      remove(this.#pointComponent);
      remove(this.#editFormComponent);
    }

    #renderPointComponent() {
      const previousPointComponent = this.#pointComponent;
      const previousEditFormComponent = this.#editFormComponent;

      this.#pointComponent = new PointView(this.#point, this.#offersByType, this.#destinations);

      this.#renderEditFormComponent();

      this.#pointComponent.setFormOpenClickHandler(this.#onFormOpenButtonClick);
      this.#pointComponent.setFavoriteButtonHandler(this.#onFavoriteChangeClick);

      if(previousPointComponent === null || previousEditFormComponent === null) {
        render(this.#pointComponent, this.#pointsListContainer);
        return;
      }

      if(this.#pointMode === PointMode.DEFAULT) {
        replace(this.#pointComponent, previousPointComponent);
      }

      if(this.#pointMode === PointMode.EDITING) {
        replace(this.#editFormComponent, previousEditFormComponent);
      }

      remove(previousPointComponent);
      remove(previousEditFormComponent);
    }

    #renderEditFormComponent() {
      this.#editFormComponent = new PointEditView(this.#point, this.#offersByType, this.#destinations);

      this.#editFormComponent.setFormSubmitHandler(this.#onFormSubmit);
      this.#editFormComponent.setFormCloseClickHandler(this.#onFormCloseButtonClick);
      this.#editFormComponent.setFormDeleteHandler(this.#onDeleteButtonClick);
    }

    #replacePointToForm() {
      replace(this.#editFormComponent, this.#pointComponent);

      document.addEventListener('keydown', this.#onEscapeKeyDown);

      this.#changePointMode();
      this.#pointMode = PointMode.EDITING;
    }

    #replaceFormToPoint() {
      this.#editFormComponent.reset(this.#point);
      replace(this.#pointComponent, this.#editFormComponent);

      document.removeEventListener('keydown', this.#onEscapeKeyDown);

      this.#pointMode = PointMode.DEFAULT;
    }

    #onFormOpenButtonClick = () => {
      this.#replacePointToForm();
    };

    #onFormCloseButtonClick = () => {
      this.#replaceFormToPoint();
    };

    #onFormSubmit = (point) => {
      const isMinorUpdate = !areDatesSame(this.#point.dateFrom, point.dateFrom)
      || !areDatesSame(this.#point.dateTo, point.dateTo)
      || this.#point.basePrice !== point.basePrice;
      this.#changeData(UserAction.UPDATE_POINT, isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH, point);
      this.#replaceFormToPoint();
    };

    #onEscapeKeyDown = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#editFormComponent.reset(this.#point);
        this.#replaceFormToPoint();
      }
    };

    #onFavoriteChangeClick = () => {
      this.#changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, {...this.#point, isFavorite: !this.#point.isFavorite});
    };

    #onDeleteButtonClick = (point) => {
      this.#changeData(UserAction.DELETE_POINT, UpdateType.MINOR, point);
    };
}
