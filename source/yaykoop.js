const browser = require('webextension-polyfill');

const yaykoop = {
	libgen: false,

	publishers: [],

	selectors: {},

	productType: {},

	syncJson: () => {
		// Sync json data with local browser data.
		fetch('https://zealous-grizzly-ravioli.glitch.me/publishers-sites.json')
			.then(response => response.json())
			.then(json => browser.storage.sync.set({data: json}));
	},

	selector: hostname => {
		// Keep the publisher HTML information.
		const element = document.querySelectorAll(yaykoop.selectors[hostname])[0];

		// Will change the publisher name to text and assign to publisherNameOnSite.
		const publisherNameOnSite = element.textContent; // Ithaki Yayınları
		return [element, publisherNameOnSite];
	},

	publisherFoundInYaykoop: (element, publisherLink) => {
		//  If the publisher is found in yaykoop this function will add YaykoopFound image.
		let elementTemporary =
			"	<a href= 'https://www.yaykoop.com/" + publisherLink.replace(/ /g, '-') + "' target='_blank'>" +
			"<img src='https://cdn.glitch.com/d5196b59-c5a5-4ffe-b82f-a0784756d723%2FPublisherFoundInYaykoop.jpg?v=1620306323808' alt='YaykoopFound' width='75' height='30'> </a>";
		if (yaykoop.libgen) {
			elementTemporary = elementTemporary + // Yaykoop needs to replace space to "-" but libgen doesn't accept it.
			"	<a href= 'https://libgen.is/search.php?req=" + publisherLink + "&open=0&res=25&view=simple&phrase=1&column=publisher' target='_blank'> LIBGEN</a>";
		}

		element.innerHTML += elementTemporary;
	},

	publisherNotFoundInYaykoop: element => {
		// If the publisher is not found in yaykoop this function will add YaykoopNotFound image.
		element.innerHTML +=
			'	<img src="https://cdn.glitch.com/d5196b59-c5a5-4ffe-b82f-a0784756d723%2FPublisherNotFoundInYaykoop.jpg?v=1620306323808" alt="YaykoopNotFound" width="75" height="30" > </img>';
	},

	matchPublisherControl: publisherNameOnSite => {
		// Checks Yaykoop database if there is an publisher name in it.
		for (let i = 0; i < yaykoop.publishers.length; i++) {
			const match = publisherNameOnSite
				.toLowerCase('tr-TR')
				.lastIndexOf(yaykoop.publishers[i].toLowerCase());

			if (match !== -1) {
				// Returning control value(true,false) and the name of lowercase publisher name.
				return [true, yaykoop.publishers[i].toLowerCase(), yaykoop.publishers[i]];
			}
		}

		return [false, publisherNameOnSite];
	},

	convertToEnglishString: publisherLink => {
		// Converting non-english characters to english and replace space with - .
		return publisherLink
			.replace(/ö/g, 'o')
			.replace(/ç/g, 'c')
			.replace(/ş/g, 's')
			.replace(/ı/g, 'i')
			.replace(/i̇/g, 'i') // First one has different ascii number.
			.replace(/ğ/g, 'g')
			.replace(/ü/g, 'u');
	},

	productTypeControl: hostname => {
		if (yaykoop.productType[hostname] !== undefined) {// Checking hostname keys
			const productTypeElement = document.querySelectorAll(yaykoop.productType[hostname]);

			// This selector will return an empty list on non-product pages so we return early
			if (productTypeElement.length === 0) {
				return false;
			}

			const type = productTypeElement[0].textContent;
			const smallCaseType = yaykoop.convertToEnglishString(type).toLowerCase();
			const productControl = smallCaseType.lastIndexOf('kitap');

			return (productControl !== -1);
		}

		return true;
	}
};

export default yaykoop;
