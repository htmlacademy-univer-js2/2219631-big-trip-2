import { sortByDate, sortByDuration } from './event-date';
import { SortType } from '../const';
const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  if(min < 0 || max < 0){
    return -1;
  }
  if(min > max){
    [min, max] = [max, min];
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (array) => {
  for(let firstIndex = array.length - 1; firstIndex > 0; firstIndex--) {
    const randomIndex = Math.floor(Math.random() * (firstIndex + 1));
    [array[firstIndex], array[randomIndex]] = [array[randomIndex], array[firstIndex]];
  }
  return array;
};

const uppperFirstSymbol = (x) => x.charAt(0).toUpperCase() + x.slice(1);

const sortEventsByType = {
  [SortType.DAY]: (events) => events.sort(sortByDate),
  [SortType.TIME]: (events) => events.sort(sortByDuration),
  [SortType.PRICE]: (events) => events.sort((currPrice, nextPrice)=>nextPrice.basePrice - currPrice.basePrice),
};


export {getRandomInteger, shuffle, uppperFirstSymbol, sortEventsByType};
