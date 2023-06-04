import { getRandomInteger, shuffle } from '../utils/common.js';
import { destinationDescriptions, destinationPlaces } from '../utils/destination.js';
import { nanoid } from 'nanoid';

const MAX_SENTENCES = 5;

const MAX_PHOTO_INDEX = 100;
const MAX_PHOTO_COUNT = 5;

const generateEventDestination = () => (
  {
    id: nanoid(),
    description: shuffle(destinationDescriptions).slice(0, getRandomInteger(0, MAX_SENTENCES)).join(' '),
    name: destinationPlaces[getRandomInteger(1, destinationPlaces.length - 1)],
    pictures: Array.from({length: getRandomInteger(0, MAX_PHOTO_COUNT)}, () => (
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, MAX_PHOTO_INDEX)}`,
        description: destinationDescriptions[getRandomInteger(0, destinationDescriptions.length - 1)],
      }
    )),
  }
);

export {generateEventDestination};
