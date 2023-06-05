import FilterView from '../view/filter-view';
import TripInfoView from '../view/trip-info-view';
import { render, RenderPosition, remove, replace } from '../framework/render';
import { filter } from '../utils/filter';
import { sortEventsByType } from '../utils/sort';
import { UpdateType, SortType } from '../const';

export default class FilterPresenter {
    #filterComponent = null;
    #filterContainer;

    #tripInfoComponent = null;
    #tripInfoContainer;

    #filterModel;
    #pointModel;
    #offersByTypeModel;
    #destinationsModel;

    constructor(filterContainer, tripInfoContainer, filterModel, pointModel, offersByTypeModel, destinationsModel) {
      this.#filterContainer = filterContainer;
      this.#tripInfoContainer = tripInfoContainer;

      this.#filterModel = filterModel;
      this.#pointModel = pointModel;
      this.#offersByTypeModel = offersByTypeModel;
      this.#destinationsModel = destinationsModel;

      this.#filterModel.addObserver(this.#handleModelEvent);
      this.#pointModel.addObserver(this.#handleModelEvent);
    }

    get filters() {
      return Array.from(Object.entries(filter), ([filterType, filterEvents]) => ({
        type: filterType,
        count: filterEvents(this.#pointModel.points).length,
      }));
    }

    get points() {
      return sortEventsByType[SortType.DAY](this.#pointModel.points);
    }

    init() {
      const previousFilterComponent = this.#filterComponent;
      const previousInfoComponent = this.#tripInfoComponent;

      const points = this.points;

      if(points.length && this.#offersByTypeModel.offersByType.length && this.#destinationsModel.destinations.length) {
        this.#tripInfoComponent = new TripInfoView(points, this.#getOverallTripPrice(points), this.#destinationsModel.destinations);
      }

      this.#filterComponent = new FilterView(this.filters, this.#filterModel.filterType);
      this.#filterComponent.setFilterTypeChangeHandler(this.#onFilterTypeChange);

      if(previousInfoComponent) {
        replace(this.#tripInfoComponent, previousInfoComponent);
        remove(previousInfoComponent);
      } else if (this.#tripInfoComponent) {
        render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      }

      if(!previousFilterComponent) {
        if(!previousInfoComponent && this.#tripInfoComponent) {
          render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
        }

        render(this.#filterComponent, this.#filterContainer);
        return;
      }

      replace(this.#filterComponent, previousFilterComponent);
      remove(previousFilterComponent);
    }

    #getOverallTripPrice(points) {
      let sum = 0;

      for(const point of points) {
        sum += point.basePrice;
        const currentOffers = this.#offersByTypeModel.offersByType.find((offer) => offer.type === point.type).offers;
        point.offers.forEach((offer) => {
          sum += currentOffers.find((currentOffer) => currentOffer.id === offer).price;
        });
      }

      return sum;
    }

      #handleModelEvent = () => {
        this.init();
      };

      #onFilterTypeChange = (filterType) => {
        if(this.#filterModel.filterType === filterType) {
          return;
        }

        this.#filterModel.setFilterType(UpdateType.MAJOR, filterType);
      };
}
