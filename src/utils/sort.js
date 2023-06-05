import { SortType } from '../const';
import { sortByDate, sortByDuration } from './event-date';

const sortEventsByType = {
  [SortType.DAY]: (events) => events.sort(sortByDate),
  [SortType.TIME]: (events) => events.sort(sortByDuration),
  [SortType.PRICE]: (events) => events.sort((currPrice, nextPrice)=>nextPrice.basePrice - currPrice.basePrice),
};
export {sortEventsByType};
