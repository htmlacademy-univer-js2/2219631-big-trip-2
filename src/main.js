import EventBoardPresenter from './presenter/events-board-presenter.js';
import PointsModel from './model/point-model.js';
import OfferByTypeModel from './model/offer-model.js';
import PointDestinationModel from './model/destination-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './point-api-service.js';


const AUTHORIZATION = 'Basic hs2323322dSD6FS34Djsh2asda5owqo2j';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const mainContainer = document.querySelector('.trip-main');
const filterContainer = mainContainer.querySelector('.trip-controls__filters');
const eventComponent = document.querySelector('.trip-events');
const newEventButton = mainContainer.querySelector('.trip-main__event-add-btn');

const offerByTypeModel = new OfferByTypeModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationModel = new PointDestinationModel(new PointsApiService(END_POINT, AUTHORIZATION));
const pointModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();


const eventPresenter = new EventBoardPresenter(eventComponent, pointModel, offerByTypeModel, destinationModel, filterModel);
const filterPresenter = new FilterPresenter(filterContainer, mainContainer, filterModel, pointModel, offerByTypeModel, destinationModel);

const onAddFormClose = () => {
  newEventButton.disabled = false;
};

const onNewEventButtonClick = () => {
  eventPresenter.createPoint(onAddFormClose);
  newEventButton.disabled = true;
};

filterPresenter.init();
eventPresenter.init();

offerByTypeModel.init().finally(()=>{
  destinationModel.init().finally(()=>{
    pointModel.init().finally(()=>{
      if (offerByTypeModel.offersByType.length && destinationModel.destinations.length) {
        newEventButton.addEventListener('click', onNewEventButtonClick);
      }
    });
  });
});
