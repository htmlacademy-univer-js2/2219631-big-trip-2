const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const PointMode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

const DESTINATION_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const DESTINATION_PLACES = ['Los Angeles', 'Toronto', 'Tokyo', 'Oakland', 'Sydney','Zurich', 'Stockholm',
  'Paris', 'London', 'Rome', 'Berlin', 'Copenhagen'];

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
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

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const OFFER_TITLES = ['Add luggage', 'Switch to comfort', 'Add meal', 'Choose seats', 'Travel by train','Call a taxi', 'Add drinks'];

export {FilterTypes, PointMode, UpdateType, UserAction, SortType, DESTINATION_DESCRIPTIONS, DESTINATION_PLACES, TYPES, OFFER_TITLES};
