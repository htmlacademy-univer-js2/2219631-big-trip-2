import TripInfoView from '../view/trip-info-view';
import FilterView from '../view/filter-view';
import MenuView from '../view/trip-menu-view';
import { render, RenderPosition } from '../render';

export default class HeaderPresenter{
  #headerContainer;
  #tripInfo;
  #menu;
  #filter;
  
  constructor(headerContainer){
    this.#headerContainer = headerContainer;
    this.#tripInfo = new TripInfoView();
    this.#menu = new MenuView();
    this.#filter = new FilterView();
  }

  init(){
    render(this.#tripInfo, this.#headerContainer, RenderPosition.AFTERBEGIN);
    render(this.#menu, this.#headerContainer.querySelector('.trip-controls__navigation'));
    render(this.#filter, this.#headerContainer.querySelector('.trip-controls__filters'));
  }
}
