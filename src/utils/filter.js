import { isPast, isFuture } from './event-date';
const filters = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const filter = {
  [filters.EVERYTHING]: (tripEvents) => tripEvents,
  [filters.FUTURE]: (tripEvents) => tripEvents.filter((point)=> isFuture(point.dateFrom, 'D') || isFuture(point.dateTo, 'D')),
  [filters.PAST]: (tripEvents) => tripEvents.filter((point) => isPast(point.dateTo, 'D') || isPast(point.dateFrom, 'D')),
};

export {filters, filter};
