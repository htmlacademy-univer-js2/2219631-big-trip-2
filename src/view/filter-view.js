import AbstractView from '../framework/view/abstract-view.js';
import { uppperFirstSymbol } from '../utils/common.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const {type, count} = filter;
  const checkedAttribute = isChecked ? 'checked' : '';
  const disabledAttribute = count === 0 ? 'disabled' : '';
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
      value="${type}" ${checkedAttribute} ${disabledAttribute}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${uppperFirstSymbol(type)}</label>
    </div>`
  );
};

const createFilterTemplate = (filterItem) => {
  const filterItems = filterItem.map((filterItem,index)=>createFilterItemTemplate(filterItem, index===0)).join('');
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItems}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
