const BASE_API_URL = "http://localhost:8000";

export function getLocalAccessToken() {
  return JSON.parse(localStorage.getItem("auth_data"))?.access;
}

export function getLocalRefreshToken() {
  return JSON.parse(localStorage.getItem("auth_data"))?.refresh;
}

export function formatTime(datetime) {
  var time = new Date(datetime);
  return formatAMPM(time);
}

export function getMediaUrl(urlPath) {
  if (!urlPath) return "";
  return `${BASE_API_URL}${urlPath}`;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export function getDate(dateTime) {
  return `${dateTime.getDate()}.${
    dateTime.getMonth() + 1
  }.${dateTime.getFullYear()}`;
}

export function getDayOfWeek(datetime) {
  return days[datetime.getDay()];
}

export function getLastSeen(lastOnlineDatetime = null) {
  if (!lastOnlineDatetime) return "last seen recently";
  const timeDiff = (new Date() - lastOnlineDatetime) / 1000;
  let hours = Math.floor(timeDiff / 3600);
  const days = Math.floor(hours / 24);
  if (days) {
    if (days === 1)
      return `last seen yesterday at ${formatAMPM(lastOnlineDatetime)}`;
    return `last seen ${getDate(lastOnlineDatetime)}`;
  }
  const allMinutes = Math.ceil(timeDiff / 60);
  const minutes = hours ? allMinutes % (hours * 60) : allMinutes;
  if (hours) {
    hours = hours + Math.round(minutes / 60);
    return `last seen ${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  return `last seen ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
}

export function getDefaultImgName(chatName) {
  const nameWords = chatName.split(" ");
  return nameWords.map((word) => word[0].toUpperCase()).join("");
}
