import HeaderPresenter from './presenter/header-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import TripEventsModel from './model/events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import TripEventDestinationModel from './model/destination-model.js';
import { getRandomInteger } from './utils/common.js';

const eventCount = 20;

const headerContainer = document.querySelector('.trip-main');
const eventComponent = document.querySelector('.trip-events');

const headerPresenter = new HeaderPresenter(headerContainer);

const offerModel = new OfferByTypeModel();
const destinationModel = new TripEventDestinationModel(eventCount);
const eventPresenter = new TripPresenter(eventComponent,
  new TripEventsModel(getRandomInteger(0,1) ? 0 : eventCount, offerModel.offers.length, destinationModel.destinations), offerModel);

headerPresenter.init();
eventPresenter.init();

