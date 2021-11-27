// Yaykoop objects and functions: publishers, selector, publisherFoundInYaykoop, publisherNotFoundInYaykoop, matchControl, convertToEnglishString
import yaykoop from './yaykoop.js';

const browser = require('webextension-polyfill');

const hostname = window.location.hostname;
console.log('YayKoop extension with Parcel is working on ' + hostname);

let element;// Keep the publisher HTML informations.
let publisherNameOnSite;// Ithaki Yayınları
let publisherLink;// Lowercase -> ithaki-yayinlari
let control;// Matching database value (true, false)
let isBookPage;// Returns true or false about productType

browser.storage.sync.get('data')
	.then(result => {
		return addPublisherLinks(result);
	});

function addPublisherLinks(result) {
	yaykoop.publishers = result.data.publishers;
	yaykoop.selectors = result.data.selectors;
	yaykoop.productType = result.data.productType;

	// Check if this page is a book page, some sites like Amazon, etc. have other product types
	isBookPage = yaykoop.productTypeControl(hostname);

	if (!isBookPage) {
		return;
	}

	// We know this is a book page, so continue processing the page content
	[element, publisherNameOnSite] = yaykoop.selector(hostname);
	[control, publisherLink, publisherNameOnSite] = yaykoop.matchPublisherControl(publisherNameOnSite);
	if (control) {
		publisherLink = yaykoop.convertToEnglishString(publisherLink);
		yaykoop.publisherFoundInYaykoop(element, publisherLink);
	} else {
		yaykoop.publisherNotFoundInYaykoop(element);
	}
}
