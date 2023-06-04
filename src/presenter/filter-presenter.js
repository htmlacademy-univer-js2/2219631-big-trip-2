import FilterView from '../view/filter-view';
import TripInfoView from '../view/trip-info-view';
import { render, RenderPosition, remove, replace } from '../framework/render';
import { filter } from '../utils/filter';
import { sortEventsByType } from '../utils/common';
import { UpdateType, SortType } from '../const';

export default class FilterPresenter {
    #filterComponent = null;
    #filterContainer;

    #tripInfoComponent = null;
    #tripInfoContainer;

    #filterModel;
    #tripEventModel;
    #offersModel;
    constructor(filterContainer, tripInfoContainer, filterModel, tripEventModel, offersModel) {
      this.#filterContainer = filterContainer;
      this.#tripInfoContainer = tripInfoContainer;

      this.#filterModel = filterModel;
      this.#tripEventModel = tripEventModel;
      this.#offersModel = offersModel;

      this.#filterModel.addObserver(this.#handleModelEvent);
      this.#tripEventModel.addObserver(this.#handleModelEvent);
    }

    get filters() {
      return Array.from(Object.entries(filter), ([filterType, filterEvents]) => ({
        type: filterType,
        count: filterEvents(this.#tripEventModel.tripEvents).length,
      }));
    }

    get tripEvents() {
      return sortEventsByType[SortType.DAY](this.#tripEventModel.tripEvents);
    }

    init() {
      const previousFilterComponent = this.#filterComponent;
      const previousInfoComponent = this.#tripInfoComponent;

      const tripEvents = this.tripEvents;

      if(tripEvents.length) {
        this.#tripInfoComponent = new TripInfoView(tripEvents, this.#getOverallTripPrice(tripEvents));
      }

      this.#filterComponent = new FilterView(this.filters, this.#filterModel.filterType);
      this.#filterComponent.setFilterTypeChangeHandler(this.#onFilterTypeChange);

      if(previousFilterComponent === null) {
        if(previousInfoComponent === null) {
          render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
        }

        render(this.#filterComponent, this.#filterContainer);
        return;
      }

      replace(this.#tripInfoComponent, previousInfoComponent);
      remove(previousInfoComponent);

      replace(this.#filterComponent, previousFilterComponent);
      remove(previousFilterComponent);
    }

    #getOverallTripPrice(tripEvents) {
      let sum = 0;

      for(const point of tripEvents) {
        sum += point.basePrice;

        point.offers.forEach((pointOffer) => {
          sum += this.#offersModel.offers.find((offer) => offer.id === pointOffer).price;
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
