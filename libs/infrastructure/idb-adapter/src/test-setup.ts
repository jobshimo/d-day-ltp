/**
 * Polyfills IndexedDB for the Node test environment using fake-indexeddb.
 * This makes IDB tests runnable without a browser or happy-dom.
 */
import 'fake-indexeddb/auto';
