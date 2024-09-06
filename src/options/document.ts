const getFavicon = (doc: Document) => {
  const link =
    doc.querySelector("link[rel='icon']") ||
    doc.querySelector("link[rel='shortcut icon']") ||
    doc.querySelector("link[rel='apple-touch-icon']") ||
    doc.querySelector("link[rel='apple-touch-icon-precomposed']") ||
    doc.querySelector("link[rel='mask-icon']") ||
    doc.querySelector("meta[itemprop='image']");

  return link?.getAttribute("href") || "";
};

export async function fetchDocument(url: string) {
  try {
    const response = await fetch(url);

    if (!response?.ok) throw new Error("Network response was not ok");
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const faviconLink = getFavicon(doc);

    return {
      favicon: faviconLink ? new URL(faviconLink, url)?.href : "",
      title: doc.title || ""
    };
  } catch (error) {
    console.error("=> Failed to fetch favicon:", error);
    return {
      favicon: "",
      title: ""
    };
  }
}

export function fetchPageDetails(url: string) {
  chrome.tabs.create({ url, active: false }, (tab) => {
    const tabId = tab.id;

    // 等待一段时间以确保页面加载完成
    setTimeout(() => {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          world: "MAIN",
          injectImmediately: false,
          func: () => {
            const baseUrl = window.location.href;
            const faviconLink = getFavicon(window.document);
            return {
              title: document.title,
              favicon: faviconLink ? new URL(faviconLink, baseUrl)?.href : ""
            };
          }
        },
        (results) => {
          if (results && results[0]) {
            const pageDetails = results[0].result;
            // 可以在这里处理页面标题和favicon，例如存储或显示在options页面
            chrome.storage.local.set({ pageDetails });

            // 关闭标签
            chrome.tabs.remove(tabId);
          }
        }
      );
    }, 3000); // 3秒，视情况可调整
  });
}
