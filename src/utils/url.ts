/**
 * 获取指定url的域名，不带协议
 * @param url string
 * @returns string
 */
export const getDomain = (url: string) => {
  if (!url) return "";
  if (!~url.indexOf("//")) url = "https://" + url;
  try {
    const u = new URL(url);
    if (u.protocol === "http:" || u.protocol === "https:") {
      return u.hostname;
    } else {
      return "";
    }
  } catch (error) {
    console.error("=> domain error: ", url, error);
    return "";
  }
};

/**
 * 获取指定url，不带协议不带参数的干净url
 * @param url string
 * @returns string
 */
export const getUrl = (url: string) => {
  if (!url) return "";
  if (!~url.indexOf("//")) url = "https://" + url;
  try {
    const u = new URL(url);
    if (u.protocol === "http:" || u.protocol === "https:") {
      if (u.pathname.endsWith("/")) u.pathname = u.pathname.slice(0, -1);
      return u.hostname + u.pathname;
    } else {
      return "";
    }
  } catch (error) {
    console.error("=> url error: ", url, error);
    return "";
  }
};

export const isHttpPage = (url: string) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (error) {
    return false;
  }
};

// 打开选项页面并传递参数
export function openOptionsPageWithParams(params: Record<string, string>) {
  const urlParams = new URLSearchParams(params).toString();
  chrome.runtime.openOptionsPage(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.update(tabs[0].id, {
          url: `chrome-extension://${chrome.runtime.id}/options.html?${urlParams}`
        });
      }
    });
  });
}

export const getUrlParams = (url: string) => {
  const u = new URL(url);
  const params = new URLSearchParams(u.search);
  return Object.fromEntries(params.entries());
};

export const paramsToObject = (params: string) => {
  if (!params || !~params.indexOf("=")) return {};
  if (params.startsWith("?")) params = params.slice(1);
  const searchParams = new URLSearchParams(params);
  const paramsObj = Object.fromEntries(searchParams.entries());
  return paramsObj;
};

export const clearParams = () => {
  const u = new URL(window.location.href);
  u.search = "";
  window.history.replaceState(null, "", u.toString());
};
