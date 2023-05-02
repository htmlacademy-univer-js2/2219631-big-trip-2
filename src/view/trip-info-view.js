import AbstractView from '../framework/view/abstract-view.js';
import { humanizeEventTime, getEarliestEvent, getLatestEvent } from '../utils/event-date.js';

const midEventsCount = 2;
const maxEventsCount = 3;

const getOverallSum = (tripEvents) => {
  let sum = 0;
  for(const point of tripEvents) {
    sum += point.basePrice;
  }
  return sum;
};

const getTripTitle = (tripEvents, earliestPoint, latestPoint) => {
  switch(tripEvents.length) {
    case 1:
      return earliestPoint.destination.name;

    case midEventsCount:
      return `${earliestPoint.destination.name} &mdash; ${latestPoint.destination.name}`;

    case maxEventsCount:
      return `${earliestPoint.destination.name} &mdash; ${tripEvents.find((point) => point.id !== earliestPoint.id && point.id !== latestPoint.id).destination.name} &mdash; ${latestPoint.destination.name}`;

    default:
      return `${earliestPoint.destination.name} &mdash; . . . &mdash; ${latestPoint.destination.name}`;
  }
};

const createTripInfoTemplate = (tripEvents) => {
  const earliestPoint = getEarliestEvent(tripEvents);
  const latestPoint = getLatestEvent(tripEvents);

  return(
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getTripTitle(tripEvents, earliestPoint, latestPoint)}</h1>
        <p class="trip-info__dates">${humanizeEventTime(earliestPoint.dateFrom, 'MMM D')}&nbsp;&mdash;&nbsp;${humanizeEventTime(latestPoint.dateTo, 'MMM D')}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${getOverallSum(tripEvents)}</span>
      </p>
    </section>`
  );
};

export default class TripInfoView extends AbstractView {
  #events;

  constructor (events) {
    super();
    this.#events = events;
  }

  get template() {
    return createTripInfoTemplate(this.#events);
  }
}
