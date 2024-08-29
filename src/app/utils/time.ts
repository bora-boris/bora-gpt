import moment from "moment";

export const getTimeSince = (timestamp: Date) => {
  const now = moment();
  const duration = moment.duration(now.diff(timestamp));

  if (duration.asSeconds() < 5) {
    return `now`; // Seconds
  } else if (duration.asSeconds() < 60) {
    return `${Math.floor(duration.asSeconds())}s`; // Seconds
  } else if (duration.asMinutes() < 60) {
    return `${Math.floor(duration.asMinutes())}m`; // Minutes
  } else if (duration.asHours() < 24) {
    return `${Math.floor(duration.asHours())}h`; // Hours
  } else {
    return `${Math.floor(duration.asDays())}d`; // Days
  }
};
