const weekInMillis = 7 * 24 * 60 * 60 * 1000; // Number of milliseconds in a week
const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const months = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
];

export const isToday = (date: Date) => new Date().toDateString() === date.toDateString();

export const isMoreThanWeekAgo = (date: Date) => {
  const diffInMillis = new Date().getTime() - date.getTime();
  return diffInMillis > weekInMillis;
};

export const isLessThanWeekAgo = (date: Date) => {
  const diffInMillis = new Date().getTime() - date.getTime();
  return diffInMillis < weekInMillis;
};

const isSameYear = (date: Date) => new Date().getFullYear() === date.getFullYear();

export const getLastMsgDate = (date: Date) => {
  if (isToday(date)) {
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  }
  if (isLessThanWeekAgo(date)) return days[date.getDay()];

  if (!isSameYear(date)) {
    return date
      .toLocaleDateString('uk-UA', { year: '2-digit', day: '2-digit', month: '2-digit' })
      .replace(/\./g, '/');
  }

  if (isMoreThanWeekAgo(date)) {
    return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }).replace('.', '/');
  }
  return '';
};

export const formatDateToUkrainian = (date: Date) => {
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};
