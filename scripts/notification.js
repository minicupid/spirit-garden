function notification(message, img) {
    loadCSS("css styles/UI/notification.css");
    const notification_container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<img src = "${img}"> <span>${message}</span>`;
    notification_container.appendChild(notification);
    notification.style.display = 'block';
    notif_sound.currentTime = 0;
    notif_sound.play();
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 2500);
    }, 3000);
}