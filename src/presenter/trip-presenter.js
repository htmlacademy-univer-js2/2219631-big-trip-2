import EventAddView from '../view/event-add-view';
import EventView from '../view/event-view';
import EventListView from '../view/event-list-view';
import EventEditView from '../view/event-edit-view';
import SortView from '../view/sort-view';
import EventOffersView from '../view/event-offers-view';
import EventDestinationView from '../view/event-destination-view';
import { render } from '../render';

const min_index = 2

export default class TripPresenter{
  constructor(tripEventsComponent, tripEventsModel, offersModel){
    this.tripEventsModel = tripEventsModel;
    this.tripEvents = [...this.tripEventsModel.getTripEvents()];

    this.offersModel = offersModel;
    this.offersByType = [...this.offersModel.getOffersByType()];

    this.tripEventsComponent = tripEventsComponent;
    this.tripEventsList = new EventListView();

    this.addEvent = new EventAddView(this.tripEvents[0]);
    this.editEvent = new EventEditView(this.tripEvents[1]);
  }
  renderTripEventForm(editForm){
    render(editForm, this.tripEventsList.getElement());
    render(new EventOffersView(editForm.tripEvent, this.offersByType),editForm.getElement().querySelector('.event__details'));
    render(new EventDestinationView(editForm.tripEvent),editForm.getElement().querySelector('.event__details'));
  }

  init(){
    render(new SortView(), this.tripEventsComponent);
    render(this.tripEventsList, this.tripEventsComponent);

    this.renderTripEventForm(this.addEvent);
    this.renderTripEventForm(this.editEvent);
    for (let i = min_index; i<this.tripEvents.length; i++){
      render(new EventView(this.tripEvents[i],this.offersByType),this.tripEventsList.getElement());
    }
  }
}