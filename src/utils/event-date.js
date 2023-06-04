import dayjs from 'dayjs';
import { getRandomInteger } from './common';

const eventTimeGap = 480;
const maxEventDuration = 48;
const minEventDuration = 1;

const maxMinutes = 60;
const maxHours = 24;

const humanizeEventTime = (dateTime, format) => dayjs(dateTime).format(format).toUpperCase();

const transformTimeDifference = (difference) => {
  let format = 'DD[D] HH[H] mm[M]';
  if(difference < maxMinutes){
    format = 'mm[M]';
  }
  else if (difference / maxMinutes < maxHours) {
    format = 'HH[H] mm[M]';
  }
  return humanizeEventTime(dayjs().date(difference/(maxMinutes*maxHours)).hour((difference/maxMinutes)%maxHours).minute(difference%maxMinutes), format);
};

const getTimeDifference = (dateFrom, dateTo) => transformTimeDifference(dayjs(dateTo).diff(dayjs(dateFrom), 'minute'));

const generateDate = () => getRandomInteger(0, 1)
  ? dayjs().add(getRandomInteger(0, eventTimeGap), 'hour').toString()
  : dayjs().subtract(getRandomInteger(0, eventTimeGap), 'hour').toString();

const generateDateTo = (dateFrom) => dayjs(dateFrom).add(getRandomInteger(minEventDuration, maxEventDuration), 'hour').toString();

const isPast = (date, unit) => dayjs().isAfter(dayjs(date), unit);

const isFuture = (date, unit) => dayjs().isBefore(dayjs(date), unit) || dayjs().isSame(dayjs(date), unit);


const sortByDate = (currentEvent, nextEvent) => {
  const dateFromDifference = dayjs(currentEvent.dateFrom).diff(dayjs(nextEvent.dateFrom));
  return dateFromDifference === 0 ? dayjs(nextEvent.dateTo).diff(dayjs(currentEvent.dateTo)) : dateFromDifference;
};

const sortByDuration = (currentEvent, nextEvent) => dayjs(nextEvent.dateTo).diff(dayjs(nextEvent.dateFrom)) - dayjs(currentEvent.dateTo).diff(dayjs(currentEvent.dateFrom));
const areDatesSame = (oldDate, newDate) => dayjs(oldDate).isSame(dayjs(newDate));
export {humanizeEventTime, getTimeDifference, generateDate, generateDateTo, isPast, isFuture, sortByDate, sortByDuration, areDatesSame};
