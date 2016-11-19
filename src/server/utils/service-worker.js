/* eslint-disable */
var CACHE_NAME = 'shield-cache';

var config = {
  name: 'shield-form',
  version: 'v1',
  cachePathPattern: /\/bower_components|\/app|\/patient|\/score|\/user|\/login|\/apache|\/dashboard|\/navigation|\/search|\/password|\/reset|\/utils|\/all|\/$/
};

function cacheName(type, options) {
  return options.name + '-' + options.version + '-' + type;
}

function addToCache (cacheKey, request, response) {
  if (response.ok) {
    var copy = response.clone(); // Response objects may be used only once. By cloning it, we are able to create a copy for the cache’s use.
    caches.open(cacheKey)
      .then(function(cache) { cache.put(request, copy); });
  }

  return response;
}

function fetchFromCache(event) {
  return caches.match(event.request)
    .then(function(response) {
      if (!response) { throw Error(event.request.url +  'not found in cache'); }
      return response;
    });
}

function cleanUpOldCaches(options) {
  return caches.keys()
    .then(function(cacheKeys) {
      var oldCacheKeys = cacheKeys.filter(function(key) { return key.indexOf(options.version) !== 0; });
      var deleteOldCacheKeys = oldCacheKeys.map(function(oldCacheKey) { return caches.delete(oldCacheKey); });

      return Promise.all(deleteOldCacheKeys);
    });
}

self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function() {
  cleanUpOldCaches(config);
});

self.addEventListener('fetch', function (event) {
  function shouldHandleFetch(event, options) {
    var request = event.request;
    var url = new URL(request.url);

    var criteria  = {
      matchesPathPattern: options.cachePathPattern.test(url.pathname),
      isGETRequest: request.method === 'GET'
    };
    var failingCriteria = Object.keys(criteria).filter(function(criteriaKey) { return !criteria[criteriaKey]; });
    return !failingCriteria.length;
  }

  function handleFetch(event, options) {
    var request = event.request;
    var acceptHeader = request.headers.get('Accept');
    var resourceType = 'static';
    var cacheKey;

    if (acceptHeader.indexOf('text/html') !== -1) {
      resourceType = 'content';
    } else if (acceptHeader.indexOf('image') !== -1) {
      resourceType = 'image';
    }

    cacheKey = cacheName(resourceType, options);

    event.respondWith(
      fetchFromCache(event)
        .then(function(response) {
          // If there is a cached version available, use it and also fetch an update for next time.
          fetch(request)
            .then(function(response) { return addToCache(cacheKey, request, response); })
            .catch(function() { console.log('There was a problem fetching an update:', request.url); });

          return response;
        })
        .catch(function() {
          return fetch(request)
            .then(function(response) { return addToCache(cacheKey, request, response); });
        })
        .catch(function() { console.log('There was a problem fetching a resource:', request.url); })
    );
  }

  if(shouldHandleFetch(event, config)) {
    handleFetch(event, config);
  }
});
