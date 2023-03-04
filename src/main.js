import HeaderPresenter from './presenter/header-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';


const tripMainElement = document.querySelector('.trip-main');
const headerPresenter = new HeaderPresenter(tripMainElement);

const eventElement = document.querySelector('.trip-events');
const eventPresenter = new TripPresenter(eventElement);

headerPresenter.init();
eventPresenter.init();

