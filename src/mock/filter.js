import { filter } from '../utils/filter';

const generateFilters = (events) => Object.entries(filter).map(
  ([filterType, filterEvents]) => ({
    type: filterType,
    count: filterEvents(events).length,
  }));

export {generateFilters};
