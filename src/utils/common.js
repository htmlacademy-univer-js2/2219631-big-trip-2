import { sortByDate, sortByDuration } from './event-date';
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
const type = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const pointMode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

const sortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const sortEventsByType = {
  [sortType.DAY]: (events) => events.sort(sortByDate),
  [sortType.TIME]: (events) => events.sort(sortByDuration),
  [sortType.PRICE]: (events) => events.sort((currPrice, nextPrice)=>nextPrice.basePrice - currPrice.basePrice),
};

const UserAction = {
  ADD_TRIP_EVENT: 'ADD_TRIP_EVENT',
  UPDATE_TRIP_EVENT: 'UPDATE_TRIP_EVENT',
  DELETE_TRIP_EVENT: 'DELETE_TRIP_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
export {getRandomInteger, shuffle, uppperFirstSymbol, type as types, pointMode, sortType as SortType, sortEventsByType, UserAction, UpdateType};
