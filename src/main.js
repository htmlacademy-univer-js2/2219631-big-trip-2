import EventBoardPresenter from './presenter/events-board-presenter.js';
import TripEventsModel from './model/events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import TripEventDestinationModel from './model/destination-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';

const eventCount = 20;

const mainContainer = document.querySelector('.trip-main');
const filterContainer = mainContainer.querySelector('.trip-controls__filters');
const eventComponent = document.querySelector('.trip-events');
const newEventButton = mainContainer.querySelector('.trip-main__event-add-btn');

const offerModel = new OfferByTypeModel();
const destinationModel = new TripEventDestinationModel(eventCount);
const eventModel = new TripEventsModel(eventCount, offerModel.offersByType, destinationModel.destinations);
const filterModel = new FilterModel();


const eventPresenter = new EventBoardPresenter(eventComponent, eventModel, offerModel, destinationModel, filterModel);
const filterPresenter = new FilterPresenter(filterContainer, mainContainer, filterModel, eventModel, offerModel);

const onAddFormClose = () => {
  newEventButton.disabled = false;
};

const onNewEventButtonClick = () => {
  eventPresenter.createTripEvent(onAddFormClose);
  newEventButton.disabled = true;
};
newEventButton.addEventListener('click', onNewEventButtonClick);
filterPresenter.init();
eventPresenter.init();

