export async function fetchDocument(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error("Network response was not ok");
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    let link =
      doc.querySelector("link[rel='icon']") ||
      doc.querySelector("link[rel='shortcut icon']");

    if (link) {
      return {
        favicon: new URL(link.getAttribute("href"), url).href,
        title: doc.title || ""
      }; // 返回 favicon 的完整 URL
    } else {
      throw new Error("No favicon found");
    }
  } catch (error) {
    console.error("=> Failed to fetch favicon:", error);
    return {
      favicon: "",
      title: ""
    };
  }
}
