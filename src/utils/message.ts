export const showMessage = async (message: string, duration: number = 4000): Promise<void> => {
  const msgElement = document.createElement("div");
  msgElement.innerText = message;
  msgElement.classList.add("message-box-item");
  const appMsgElement = document.getElementById("app-message")!;
  appMsgElement.appendChild(msgElement);

  console.log("duration:", duration);

  return new Promise((reslove, reject) => {
    setTimeout(() => {
      setTimeout(() => {
        appMsgElement.removeChild(msgElement);
        reslove();
      }, duration);
    }, 500);
  });
};