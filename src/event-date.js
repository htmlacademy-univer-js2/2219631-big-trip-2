import dayjs from 'dayjs';
import { getRandomInteger } from './utils';

const event_time_gap = 480;
const max_event_duration = 48;
const min_event_duration = 1;

const max_minutes = 60;
const max_hours = 24;

const humanizeEventTime = (dateTime, format) => dayjs(dateTime).format(format).toUpperCase();

const transformTimeDifference = (difference) => {
  if(difference < max_minutes){
    return humanizeEventTime(dayjs().minute(difference), 'mm[M]');
  }
  else if (difference / max_minutes < max_hours) {
    return humanizeEventTime(dayjs().hour(difference), 'HH[H] mm[M]');
  }
  return humanizeEventTime(dayjs().date(difference), 'DD[D] HH[H] mm[M]');
};

const getTimeDifference = (dateFrom, dateTo) => transformTimeDifference(dayjs(dateTo).diff(dayjs(dateFrom), 'minute'));

const generateDate = () => dayjs().add(getRandomInteger(0, event_time_gap), 'hour').toString();

const generateDateTo = (dateFrom) => dayjs(dateFrom).add(getRandomInteger(min_event_duration, max_event_duration), 'hour').toString();

export {humanizeEventTime, getTimeDifference, generateDate, generateDateTo};