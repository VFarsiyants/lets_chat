const BASE_API_URL = "http://localhost:8000";

export function getLocalAccessToken() {
  return JSON.parse(localStorage.getItem("auth_data"))?.access;
}

export function formatTime(datetime) {
  var time = new Date(datetime);
  return time
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toLowerCase();
}

export function getMediaUrl(urlPath) {
  return `${BASE_API_URL}${urlPath}`;
}
