const browser = require('webextension-polyfill');
import yaykoop from './yaykoop.js';

browser.runtime.onStartup.addListener(yaykoop.syncJson);
browser.runtime.onInstalled.addListener(yaykoop.syncJson);
