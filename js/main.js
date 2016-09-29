'use strict';
var sub;
var reg;
var isSubscribed = false;
var subscribeButton = document.querySelector('.btnRecieve');
if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('sw.js').then(function() {
    return navigator.serviceWorker.ready;
  }).then(function(serviceWorkerRegistration) {
	reg=serviceWorkerRegistration;
    console.log('Service Worker is ready :^)', reg);
  }).catch(function(error) {
    console.log('Service Worker error :^(', error);
  });
}
subscribeButton.addEventListener('click', function() {
  if (isSubscribed) {
    unsubscribe();
  } else {
    subscribe();
  }
});

function subscribe() {
  reg.pushManager.subscribe({userVisibleOnly: true}).
  then(function(pushSubscription) {
    sub = pushSubscription;
    console.log('Subscribed! Endpoint:', sub.endpoint);
	localStorage.setItem("token",sub.endpoint);
    subscribeButton.textContent = 'Không nhận thông báo từ Wego';
    isSubscribed = true;

	var data = { "token" : localStorage.getItem("token") };
	$.ajax({
		type: "POST",
		url: "https://52.54.173.11:443/push/token",
		processData: false,
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function(r) {
			
		}
	});
  });
}

function unsubscribe() {
  sub.unsubscribe().then(function(event) {
    subscribeButton.textContent = 'Nhận thông tin từ Wego';
    console.log('Unsubscribed!', event);
    isSubscribed = false;
  }).catch(function(error) {
    console.log('Error unsubscribing', error);
    subscribeButton.textContent = 'Subscribe';
  });
}



/*
var abc = localStorage.getItem("token");
$(document).ready(function(){
  $.post("http://localhost:3003/push/token",
	{
	"token":"eqwe"
	},
    function(data, status){
        alert("Data: ");
    }); 
  });
  */
