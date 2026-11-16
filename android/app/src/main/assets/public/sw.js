/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "afe77374622febc4fe2e41f7b8fdc94e"
  }, {
    "url": "pwa-512x512.png",
    "revision": "09edae3aeb2f691a04d607eb8c81e87b"
  }, {
    "url": "pwa-192x192.png",
    "revision": "d4b9b27084b38fcea4fd5c7b8602454d"
  }, {
    "url": "index.html",
    "revision": "63b6305b844749678f14f13dc9f893cf"
  }, {
    "url": "icon.svg",
    "revision": "3f106f2d7053f63ac15fd6114a940478"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "1705984309f159746bb3942ce8ef22a5"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/purify.es-Bvo9QlJ8.js",
    "revision": null
  }, {
    "url": "assets/index.es-DdikAlEN.js",
    "revision": null
  }, {
    "url": "assets/index-DmsCB-pp.css",
    "revision": null
  }, {
    "url": "assets/index-BRT_Daqf.js",
    "revision": null
  }, {
    "url": "assets/html2canvas-CSw9TpGf.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "1705984309f159746bb3942ce8ef22a5"
  }, {
    "url": "icon.svg",
    "revision": "3f106f2d7053f63ac15fd6114a940478"
  }, {
    "url": "pwa-192x192.png",
    "revision": "d4b9b27084b38fcea4fd5c7b8602454d"
  }, {
    "url": "pwa-512x512.png",
    "revision": "09edae3aeb2f691a04d607eb8c81e87b"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "afe77374622febc4fe2e41f7b8fdc94e"
  }, {
    "url": "manifest.webmanifest",
    "revision": "9eeea6feda45059399894c664dc6beb4"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
