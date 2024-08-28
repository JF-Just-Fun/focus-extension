export async function fetchDocument(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error("Network response was not ok");
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const link =
      doc.querySelector("link[rel='icon']") ||
      doc.querySelector("link[rel='shortcut icon']") ||
      doc.querySelector("link[rel='apple-touch-icon']") ||
      doc.querySelector("link[rel='apple-touch-icon-precomposed']") ||
      doc.querySelector("link[rel='mask-icon']") ||
      doc.querySelector("meta[itemprop='image']");

    return {
      favicon: link ? new URL(link.getAttribute("href"), url)?.href : "",
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
