const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const PointMode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const UserAction = {
  ADD_POINT: 'ADD_POINT',
  UPDATE_POINT: 'UPDATE_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];


export {FilterTypes, PointMode, UpdateType, UserAction, SortType, TYPES};
