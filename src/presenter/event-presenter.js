import EventView from '../view/event-view';
import EventEditView from '../view/event-edit-view';
import EventOffersView from '../view/event-offers-view';
import EventDestinationView from '../view/event-destination-view';
import { render, replace, remove } from '../framework/render';
import { pointMode } from '../utils/common';

export default class EventPresenter{
    #eventComponent;
    #editFormComponent;
    #eventsListContainer;
    #tripEvent;
    #offersByType;
    #offersComponent;
    #destinationComponent;
    #changeData;
    #changePointMode;
    #pointMode;

    constructor(eventsListContainer, offersByType, changeData, changePointMode) {
      this.#eventsListContainer = eventsListContainer;
      this.#offersByType = offersByType;

      this.#changeData = changeData;
      this.#changePointMode = changePointMode;

      this.#pointMode = pointMode.DEFAULT;

      this.#eventComponent = null;
      this.#editFormComponent = null;
    }

    init(event) {
      this.#tripEvent = event;
      this.#renderEventComponent();
    }

    resetEventMode() {
      if(this.#pointMode === pointMode.EDITING) {
        this.#replaceFormToPoint();
      }
    }

    destroy() {
      remove(this.#eventComponent);
      remove(this.#editFormComponent);
    }

    #renderEventComponent() {
      const previousEventComponent = this.#eventComponent;
      const previousEditFormComponent = this.#editFormComponent;

      this.#eventComponent = new EventView(this.#tripEvent, this.#offersByType);

      this.#renderEditFormComponent();

      this.#eventComponent.setFormOpenClickHandler(this.#onFormOpenButtonClick);
      this.#eventComponent.setFavoriteButtonHandler(this.#onFavoriteChangeClick);

      if(previousEventComponent === null || previousEditFormComponent === null) {
        render(this.#eventComponent, this.#eventsListContainer);
        return;
      }

      if(this.#pointMode === pointMode.DEFAULT) {
        replace(this.#eventComponent, previousEventComponent);
      }

      if(this.#pointMode === pointMode.EDITING) {
        replace(this.#editFormComponent, previousEditFormComponent);
      }

      remove(previousEventComponent);
      remove(previousEditFormComponent);
    }

    #renderEditFormComponent() {
      this.#editFormComponent = new EventEditView(this.#tripEvent, this.#offersByType);

      this.#editFormComponent.setFormSubmitHandler(this.#onFormSubmit);
      this.#editFormComponent.setFormCloseClickHandler(this.#onFormCloseButtonClick);
    }

    #replacePointToForm() {
      replace(this.#editFormComponent, this.#eventComponent);

      document.addEventListener('keydown', this.#onEscapeKeyDown);

      this.#changePointMode();
      this.#pointMode = pointMode.EDITING;
    }

    #replaceFormToPoint() {
      this.#editFormComponent.reset(this.#tripEvent);
      replace(this.#eventComponent, this.#editFormComponent);

      document.removeEventListener('keydown', this.#onEscapeKeyDown);

      this.#pointMode = pointMode.DEFAULT;
    }

    #onFormOpenButtonClick = () => {
      this.#replacePointToForm();
    };

    #onFormCloseButtonClick = () => {
      this.#replaceFormToPoint();
    };

    #onFormSubmit = (tripEvent) => {
      this.#changeData(tripEvent);
      this.#replaceFormToPoint();
    };

    #onEscapeKeyDown = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#editFormComponent.reset(this.#tripEvent);
        this.#replaceFormToPoint();
      }
    };

    #onFavoriteChangeClick = () => {
      this.#changeData({...this.#tripEvent, isFavorite: !this.#tripEvent.isFavorite});
    };
}
