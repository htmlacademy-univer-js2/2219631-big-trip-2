import EventAddView from '../view/event-add-view';
import EventView from '../view/event-view';
import EventListView from '../view/event-list-view';
import EventEditView from '../view/event-edit-view';
import SortView from '../view/sort-view';
import { render, RenderPosition } from '../render';

export default class TripPresenter{
  constructor(tripContainer){
    this.tripContainter = tripContainer;
    this.eventList = new EventListView();
    this.addEvent = new EventAddView();
    this.editEvent = new EventEditView();
  }

  init(){
    render(new SortView(),this.tripContainter);
    render(this.editEvent, this.tripContainter);
    render(this.eventList, this.tripContainter);
    for (let i=0; i<3; i++){
      render(new EventView(), this.eventList.getElement());
    }
  }
}