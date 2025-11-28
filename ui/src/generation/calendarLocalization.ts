// From https://www.abeautifulsite.net/posts/getting-localized-month-and-day-names-in-the-browser/
export function getDayNames(locale = 'en', format = 'long') {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: format,
    timeZone: 'UTC',
  });
  const days = [1, 2, 3, 4, 5, 6, 7].map((day) => {
    const dd = day < 10 ? `0${day}` : day;
    return new Date(`2017-01-${dd}T00:00:00+00:00`);
  });
  return days.map((date) => formatter.format(date));
}

export function getMonthNames(locale = 'en', format = 'long') {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: format,
    timeZone: 'UTC',
  });
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
    const mm = month < 10 ? `0${month}` : month;
    return new Date(`2017-${mm}-01T00:00:00+00:00`);
  });
  return months.map((date) => formatter.format(date));
}
