function InvalidatePopup() {
  const { description } = chrome.runtime.getManifest();
  return (
    <div
      style={{
        padding: 16,
        width: "200px"
      }}>
      {description}
    </div>
  );
}

export default InvalidatePopup;
