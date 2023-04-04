import dayjs from 'dayjs';
import { getRandomInteger } from './utils';

const eventTimeGap = 480;
const maxEventDuration = 48;
const minEventDuration = 1;

const maxMinutes = 60;
const maxHours = 24;

const humanizeEventTime = (dateTime, format) => dayjs(dateTime).format(format).toUpperCase();

const transformTimeDifference = (difference) => {
  if(difference < maxMinutes){
    return humanizeEventTime(dayjs().minute(difference), 'mm[M]');
  }
  else if (difference / maxMinutes < maxHours) {
    return humanizeEventTime(dayjs().hour(difference), 'HH[H] mm[M]');
  }
  return humanizeEventTime(dayjs().date(difference), 'DD[D] HH[H] mm[M]');
};

const getTimeDifference = (dateFrom, dateTo) => transformTimeDifference(dayjs(dateTo).diff(dayjs(dateFrom), 'minute'));

const generateDate = () => dayjs().add(getRandomInteger(0, eventTimeGap), 'hour').toString();

const generateDateTo = (dateFrom) => dayjs(dateFrom).add(getRandomInteger(minEventDuration, maxEventDuration), 'hour').toString();

export {humanizeEventTime, getTimeDifference, generateDate, generateDateTo};
