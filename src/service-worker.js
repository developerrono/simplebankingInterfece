/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST || []);

// Optional: cache strategy
self.addEventListener('fetch', () => {});
