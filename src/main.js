import HeaderPresenter from './presenter/header-presenter.js';
import EventBoardPresenter from './presenter/events-board-presenter.js';
import TripEventsModel from './model/events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import TripEventDestinationModel from './model/destination-model.js';
import { getRandomInteger } from './utils/common.js';
import { generateFilters } from './mock/filter.js';

const eventCount = 20;

const headerContainer = document.querySelector('.trip-main');
const eventComponent = document.querySelector('.trip-events');

const offerModel = new OfferByTypeModel();
const destinationModel = new TripEventDestinationModel(eventCount);
const eventModel = new TripEventsModel(getRandomInteger(0,1) ? 0 : eventCount, offerModel.offers.length, destinationModel.destinations);
const filters = generateFilters(eventModel.tripEvents);

const headerPresenter = new HeaderPresenter(headerContainer, filters, eventModel.tripEvents);
const eventPresenter = new EventBoardPresenter(eventComponent, eventModel, offerModel);

headerPresenter.init();
eventPresenter.init();

