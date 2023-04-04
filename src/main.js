import HeaderPresenter from './presenter/header-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import TripEventsModel from './model/events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import EventDestinationModel from './model/destination-model.js';

const eventCount = 20;

const tripMainElement = document.querySelector('.trip-main');
const headerPresenter = new HeaderPresenter(tripMainElement);

const eventComponent = document.querySelector('.trip-events');
///const eventPresenter = new TripPresenter(eventElement);
const offerModel = new OfferByTypeModel();
const destinationModel = new EventDestinationModel(eventCount);
const eventPresenter = new TripPresenter(eventComponent, new TripEventsModel(eventCount, offerModel.getOffers().length,
  destinationModel.getDestinations()), offerModel);

headerPresenter.init();
eventPresenter.init();

