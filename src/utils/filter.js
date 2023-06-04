import { isPast, isFuture } from './event-date';
import { FilterTypes } from '../const';

const filter = {
  [FilterTypes.EVERYTHING]: (tripEvents) => tripEvents,
  [FilterTypes.FUTURE]: (tripEvents) => tripEvents.filter((point)=> isFuture(point.dateFrom, 'D') || isFuture(point.dateTo, 'D')),
  [FilterTypes.PAST]: (tripEvents) => tripEvents.filter((point) => isPast(point.dateTo, 'D') || isPast(point.dateFrom, 'D')),
};

export {filter};
