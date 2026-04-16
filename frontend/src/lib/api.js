const configuredBaseUrl = process.env.REACT_APP_BACKEND_URL?.trim();

function getBaseUrl() {
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  return "";
}

export const API = `${getBaseUrl()}/api`;
