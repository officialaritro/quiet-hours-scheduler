export function formatDateTime(date, time) {
  return new Date(`${date}T${time}`);
}

export function isValidTimeRange(startTime, endTime) {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return end > start;
}

export function getTimezoneOffset() {
  return new Date().getTimezoneOffset();
}

export function convertToUTC(dateString, timeString, timezone = 'UTC') {
  const localDateTime = new Date(`${dateString}T${timeString}`);
  return new Date(localDateTime.toISOString());
}

export function getReminderTime(studyBlockDateTime, minutesBefore = 10) {
  return new Date(studyBlockDateTime.getTime() - minutesBefore * 60 * 1000);
}

export function isUpcoming(date, startTime) {
  const blockDateTime = new Date(`${date}T${startTime}`);
  return blockDateTime > new Date();
}
