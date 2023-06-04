import { getRandomInteger, shuffle } from '../utils/common.js';
import {DESTINATION_DESCRIPTIONS, DESTINATION_PLACES } from '../const.js';
import { nanoid } from 'nanoid';

const MAX_SENTENCES = 5;

const MAX_PHOTO_INDEX = 100;
const MAX_PHOTO_COUNT = 5;

const generateEventDestination = () => (
  {
    id: nanoid(),
    description: shuffle(DESTINATION_DESCRIPTIONS).slice(0, getRandomInteger(0, MAX_SENTENCES)).join(' '),
    name: DESTINATION_PLACES[getRandomInteger(1, DESTINATION_PLACES.length - 1)],
    pictures: Array.from({length: getRandomInteger(0, MAX_PHOTO_COUNT)}, () => (
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, MAX_PHOTO_INDEX)}`,
        description: DESTINATION_DESCRIPTIONS[getRandomInteger(0, DESTINATION_DESCRIPTIONS.length - 1)],
      }
    )),
  }
);

export {generateEventDestination};
