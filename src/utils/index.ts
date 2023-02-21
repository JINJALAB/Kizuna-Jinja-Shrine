import {
  CHAINCONFIG_TEST,
  CONTRACTADDRESS_TEST,
  overpay,
} from "constant/index";
import moment from "moment";
import "moment/locale/ja";
moment.locale("ja");
const timeZone = -9;
const timeZoneDispalyInfo = "(UTC+9:00)";

export const setLocalStorage = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};

export const getLocalStorge = (key: string) => {
  return window.localStorage.getItem(key);
};

export const isValidNumUSD = (value: string): boolean => {
  const regPos = /^((\d*(\.\d{0,8})$)|(\d+$))/;
  if (regPos.test(value)) {
    return true;
  }
  return false;
};
export const isValidNumETH = (value: string): boolean => {
  const regPos = /^((\d*(\.\d{0,18})$)|(\d+$))/;
  if (regPos.test(value)) {
    return true;
  }
  return false;
};
export const getDisplayTime = (timeStamp: number) => {
  var day = new Date(timeStamp);
  return moment(day).utc().zone(timeZone).format("LLL") + timeZoneDispalyInfo;
};

export const calPrice = (value: number) => {
  return Number((value * overpay).toFixed());
};

export const encodeParams = (value: string) => {
  return encodeURIComponent(value);
};
export const decodeParams = (value: string) => {
  return decodeURIComponent(value);
};

export const getQueryParams = (name: string, url = window.location.href) => {
  // eslint-disable-next-line no-useless-escape
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const formateToNum = (value: string | number = "") => {
  return Math.floor(Number(value) * Math.pow(10, 8)) / Math.pow(10, 8);
};

export const getIsProd = () => {
  return window.location.hostname.includes("prod") &&
    window.location.hostname !== "localhost"
    ? true
    : false;
};

export const getAddressConfig = () => {
  return CONTRACTADDRESS_TEST;
};

export const getChainConfig = () => {
  return CHAINCONFIG_TEST;
};

export function isMobile() {
  const userAgent = navigator.userAgent;
  const agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  return agents.some((x) => userAgent.includes(x));
}
