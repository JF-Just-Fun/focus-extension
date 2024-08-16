/**
 * 获取指定url的域名，不带协议
 * @param url string
 * @returns string
 */
export const getDomain = (url: string) => {
  return new URL(url).hostname;
};

/**
 * 获取指定url，不带协议不带参数的干净url
 * @param url string
 * @returns string
 */
export const getUrl = (url: string) => {
  const u = new URL(url);
  if (!u.pathname.endsWith("/")) u.pathname += '/';
  return u.hostname + u.pathname;
};
