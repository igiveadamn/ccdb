console.log('HERE IS MY SERVICE WORKER FILE');

self.addEventListener('sync', function (event) {
  if (event.tag === 'submit-form-data') {
    event.waitUntil(fetchDogImage());
  }
});

function fetchDogImage () {
  fetch('https://dl.dropboxusercontent.com/u/602885/github/sniper-squirrel.jpg')
    .then(function (response) {
      return response;
    })
    .then(function (text) {
      console.log('CHARLIE');
      console.log('Request successful', text);
    })
    .catch(function (error) {
      console.log('Request failed', error);
    });
}