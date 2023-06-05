import { isPast, isFuture } from './event-date';
import { FilterTypes } from '../const';

const filter = {
  [FilterTypes.EVERYTHING]: (points) => points,
  [FilterTypes.FUTURE]: (points) => points.filter((point)=> isFuture(point.dateFrom, 'D') || isFuture(point.dateTo, 'D')),
  [FilterTypes.PAST]: (points) => points.filter((point) => isPast(point.dateTo, 'D') || isPast(point.dateFrom, 'D')),
};

export {filter};
