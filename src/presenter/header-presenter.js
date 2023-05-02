import TripInfoView from '../view/trip-info-view';
import FilterView from '../view/filter-view';
import MenuView from '../view/trip-menu-view';
import { render, RenderPosition } from '../framework/render';

export default class HeaderPresenter{
  #headerContainer;
  #events;
  #menu;
  #filter;

  constructor(headerContainer, filters, events){
    this.#headerContainer = headerContainer;
    this.#events = events;
    this.#menu = new MenuView();
    this.#filter = new FilterView(filters);
  }

  init(){
    if (this.#events.length !== 0) {
      render(new TripInfoView(this.#events), this.#headerContainer, RenderPosition.AFTERBEGIN);
    }
    render(this.#menu, this.#headerContainer.querySelector('.trip-controls__navigation'));
    render(this.#filter, this.#headerContainer.querySelector('.trip-controls__filters'));
  }
}
