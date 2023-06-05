import { SortType } from '../const';
import { sortByDate, sortByDuration } from './point-date';

const sortPointsByType = {
  [SortType.DAY]: (points) => points.sort(sortByDate),
  [SortType.TIME]: (points) => points.sort(sortByDuration),
  [SortType.PRICE]: (points) => points.sort((currPrice, nextPrice)=>nextPrice.basePrice - currPrice.basePrice),
};
export {sortPointsByType};
