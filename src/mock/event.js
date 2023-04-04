import { getRandomInteger, shuffle } from '../utils.js';
import { generateDateTo } from '../event-date.js';

const MIN_BASE_PRICE = 1000;
const MAX_BASE_PRICE = 10000;

const generateTripEvent = (id, type, offersCount, destination, dateFrom) => (
  {
    id,
    basePrice: getRandomInteger(MIN_BASE_PRICE, MAX_BASE_PRICE),
    dateFrom,
    dateTo: generateDateTo(dateFrom),
    destination,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: shuffle(Array.from({length: offersCount}, (offer, i) => i)).slice(0, getRandomInteger(1, offersCount)),
    type,
  }
);

export {generateTripEvent};
