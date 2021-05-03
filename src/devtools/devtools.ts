import { DevpanelMessageCenter } from './devpanel-message-center';

// 见: https://stackoverflow.com/a/11677744/12023702
chrome.devtools.panels.create("FE Dev Tools", "", "devpanel.html", (panel: chrome.devtools.panels.ExtensionPanel) => {
  let _window: Window & { devpanelMessageCenter?: DevpanelMessageCenter }; // Going to hold the reference to devpanel.html's `window`

  const data: any[] = [];
  const port = chrome.runtime.connect({ name: "devtools" });
  port.onMessage.addListener((msg: any) => {
    // Write information to the panel, if exists.
    // If we don't have a panel reference (yet), queue the data.
    if (_window) {
      _window.devpanelMessageCenter?.receive(msg);
    } else {
      data.push(msg);
    }
  });

  panel.onShown.addListener(function tmp(panelWindow) {
    panel.onShown.removeListener(tmp); // Run once only
    _window = panelWindow;

    // Just to show that it's easy to talk to pass a msage back:
    _window.devpanelMessageCenter?.setResponseFn((msg: any) => {
      port.postMessage(msg);
    });

    // Release queued data
    let msg;
    while (msg = data.shift()) {
      _window.devpanelMessageCenter?.receive(msg);
    }
  });
});