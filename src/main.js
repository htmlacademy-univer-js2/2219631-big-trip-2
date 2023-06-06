import PointsBoardPresenter from './presenter/points-board-presenter.js';
import PointsModel from './model/point-model.js';
import OfferByTypeModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './point-api-service.js';


const AUTHORIZATION = 'Basic hs2323322dSD6FS34Djsh2asda5owqo2j2';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const filterContainer = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const newEventButtonContainer = tripMainElement.querySelector('.trip-main__event-add-btn');

const offerByTypeModel = new OfferByTypeModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationModel = new DestinationModel(new PointsApiService(END_POINT, AUTHORIZATION));
const pointModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();


const boardPresenter = new PointsBoardPresenter(tripEventsElement, pointModel, offerByTypeModel, destinationModel, filterModel);
const filterPresenter = new FilterPresenter(filterContainer, tripMainElement, filterModel, pointModel, offerByTypeModel, destinationModel);

const handleNewEventClose = () => {
  newEventButtonContainer.disabled = false;
};

const handleNewEventButtonClick = () => {
  boardPresenter.createPoint(handleNewEventClose);
  newEventButtonContainer.disabled = true;
};

filterPresenter.init();
boardPresenter.init();

offerByTypeModel.init().finally(()=>{
  destinationModel.init().finally(()=>{
    pointModel.init().finally(()=>{
      newEventButtonContainer.addEventListener('click', handleNewEventButtonClick);
    });
  });
});
