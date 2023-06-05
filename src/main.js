import EventBoardPresenter from './presenter/events-board-presenter.js';
import TripEventsModel from './model/events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import TripEventDestinationModel from './model/destination-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import EventsApiService from './event-api-service.js';


const AUTHORIZATION = 'Basic hs2323322dSD6FS34Djsh2asda5owqo2j';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const mainContainer = document.querySelector('.trip-main');
const filterContainer = mainContainer.querySelector('.trip-controls__filters');
const eventComponent = document.querySelector('.trip-events');
const newEventButton = mainContainer.querySelector('.trip-main__event-add-btn');

const offerModel = new OfferByTypeModel(new EventsApiService(END_POINT, AUTHORIZATION));
const destinationModel = new TripEventDestinationModel(new EventsApiService(END_POINT, AUTHORIZATION));
const eventModel = new TripEventsModel(new EventsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();


const eventPresenter = new EventBoardPresenter(eventComponent, eventModel, offerModel, destinationModel, filterModel);
const filterPresenter = new FilterPresenter(filterContainer, mainContainer, filterModel, eventModel, offerModel, destinationModel);

const onAddFormClose = () => {
  newEventButton.disabled = false;
};

const onNewEventButtonClick = () => {
  eventPresenter.createTripEvent(onAddFormClose);
  newEventButton.disabled = true;
};

filterPresenter.init();
eventPresenter.init();

offerModel.init().finally(()=>{
  destinationModel.init().finally(()=>{
    eventModel.init().finally(()=>{
      if (offerModel.offers.length && destinationModel.destinations.length) {
        newEventButton.addEventListener('click', onNewEventButtonClick);
      }
    });
  });
});
