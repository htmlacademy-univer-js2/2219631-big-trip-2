import PointEditView from '../view/point-edit-view';
import { RenderPosition, remove, render } from '../framework/render';
import { UserAction, UpdateType, TYPES } from '../const';
import dayjs from 'dayjs';


export default class PointNewPresenter{
    #pointsListContainer;
    #addFormComponent = null;

    #offersByType;
    #destinations;

    #changeData;
    #destroyCallback = null;
    constructor(pointsListContainer, offersByType, destinations, changeData) {
      this.#pointsListContainer = pointsListContainer;

      this.#offersByType = offersByType;
      this.#destinations = destinations;

      this.#changeData = changeData;
    }

    init(destroyCallback) {
      this.#destroyCallback = destroyCallback;

      this.#renderAddFormComponent();
    }

    destroy() {
      if(this.#addFormComponent === null) {
        remove(this.#addFormComponent);
      }

      this.#destroyCallback?.();

      remove(this.#addFormComponent);
      this.#addFormComponent = null;

      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    }

    setSaving = () => {
      this.#addFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    };

    setAborting = () => {
      const resetFormState = () => {
        this.#addFormComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      };

      this.#addFormComponent.shake(resetFormState);
    };

      #renderAddFormComponent() {
      if(this.#addFormComponent !== null) {
        return;
      }

      this.#addFormComponent = new PointEditView(this.#generateDefaultPoint(), this.#offersByType, this.#destinations, true);

      this.#addFormComponent.setFormSubmitHandler(this.#onFormSubmit);
      this.#addFormComponent.setFormDeleteHandler(this.#onCancelButtonClick);

      render(this.#addFormComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

      document.addEventListener('keydown', this.#onEscapeKeyDown);
    }

      #onFormSubmit = (point) => {
        this.#changeData(UserAction.ADD_POINT, UpdateType.MINOR, point);
      };

      #onEscapeKeyDown = (evt) => {
        if(evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          this.destroy();
        }
      };

      #onCancelButtonClick = () => {
        this.destroy();
      };

      #generateDefaultPoint(){
        return{
            id: 0,
            basePrice: 0,
            dateFrom: dayjs().toString(),
            dateTo: dayjs().toString(),
            destination: this.#destinations[0].id,
            isFavorite: false,
            offers: [],
            type: TYPES[0],
        }
      }
}
