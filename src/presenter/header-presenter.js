import TripInfoView from '../view/trip-info-view';
import FilterView from '../view/filter-view';
import MenuView from '../view/trip-menu-view';
import { render, RenderPosition } from '../render';

export default class HeaderPresenter{
  constructor(headerContainter){
    this.headerContainter = headerContainter;
    this.tripInfo = new TripInfoView();
    this.menu = new MenuView();
    this.filter = new FilterView();
  }

  init(){
    render(this.tripInfo, this.headerContainter, RenderPosition.AFTERBEGIN);
    render(this.menu, this.headerContainter.querySelector('.trip-controls__navigation'));
    render(this.filter, this.headerContainter.querySelector('.trip-controls__filters'));
  }
}
