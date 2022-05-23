import moment from 'moment';

export const parseDate = (dateJSON) => {
  return moment(dateJSON);
};

export const displayDate = (dateJSON) => {
  return parseDate(dateJSON).format('MMMM Do YYYY, h:mm:ss A');
};

export const sortDescByDate = (items, dateKey) => {
  return items.sort(
    (a, b) => parseDate(b[dateKey]).unix() - parseDate(a[dateKey]).unix(),
  );
};
