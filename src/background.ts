import { DevpanelMessage, DevpanelMessageType } from "./devtools/devpanel-message-center";

chrome.contextMenus.create({
  title: "FED - BARCODE: [%s]",
  contexts: ["selection"],
  onclick: addBarcode
});

const ports: chrome.runtime.Port[] = [];
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "devtools") return;

  ports.push(port);
  // Remove port when destoryed (eg when devtools instance is closed)
  port.onDisconnect.addListener((msg) => {
    let i = ports.indexOf(port);
    if (i !== -1) ports.splice(i, 1);
  });
  port.onMessage.addListener((msg) => {
    // Received message form devtools. Do something:
    console.log('[FED][Received message from devtools page]:', msg);
  });
});

// Funciton to send a mesage to all devtools.html views:
function notifyDevtools(msg: DevpanelMessage<any>) {
  ports.forEach((port) => {
    port.postMessage(msg);
  });
}

function addBarcode(info: chrome.contextMenus.OnClickData) {
  console.log(`[FED] [[${info.selectionText}]] was clicked.`);
  if (info.selectionText) {
    notifyDevtools(new DevpanelMessage(DevpanelMessageType.showBarcode, info.selectionText));
  }
}
