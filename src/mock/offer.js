import { getRandomInteger } from '../utils/common.js';

const minOfferPrice = 25;
const maxOfferPrice = 200;

const generateOffer = (id, title) => (
  {
    id,
    title: title,
    price: getRandomInteger(minOfferPrice, maxOfferPrice),
  }
);

const generateOffersByType = (type, offers) => (
  {
    type,
    offers,
  }
);

export {generateOffersByType, generateOffer};
