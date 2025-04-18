const showNotification = (message) => {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "#2ecc71";
  notification.style.color = "white";
  notification.style.padding = "12px 24px";
  notification.style.borderRadius = "4px";
  notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  notification.style.zIndex = "1000";
  notification.style.transition = "opacity 0.3s ease";

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};

export { showNotification };
