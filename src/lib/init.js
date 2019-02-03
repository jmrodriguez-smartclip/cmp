import { h, render } from 'preact';
import Promise from 'promise-polyfill';
import Store from './store';
import Cmp, { CMP_GLOBAL_NAME } from './cmp';
import {readVendorConsentCookie, readPublisherConsentCookie, readCookie} from './cookie/cookie';
import { fetchPubVendorList, fetchGlobalVendorList, fetchPurposeList } from './vendor';
import log from './log';
import pack from '../../package.json';
import config from './config';

const CMP_VERSION = 1;

// CMP_ID is the ID of your consent management provider according to the IAB. Get an ID here: https://advertisingconsent.eu/cmps/
const CMP_ID = 0;

// The cookie specification version, as determined by the IAB. Current is 1.
const COOKIE_VERSION = 1;
export const COOKIE_VERSION_COOKIE_NAME = "_pubVersion_";

export function init(configUpdates) {
	config.update(configUpdates);
	log.debug('Using configuration:', config);
	const startTime = Date.now();
	let cmp = null;

	global.SMC_SetupDFP = function (CONST_DFP_ID) {
		if (CONST_DFP_ID == undefined)
			CONST_DFP_ID = 10000;
		let DFP_CONSENTS_VALUE = null;
		let googletag = global.googletag;
		let loadedPromise;
		let delayedAds = 0;
		loadedPromise = new Promise((resolve, reject) => {
			googletag.__display = googletag.display;
			googletag.display = function (divId) {

				googletag.__display(divId);
				let divSlot = null;
				googletag.pubads().getSlots().map(function (i) {
					if (i.getSlotElementId() == divId)
						divSlot = i;
				});
				loadedPromise.then(() => {
					if (divSlot)
						googletag.pubads().refresh([divSlot]);
				});
			};
			googletag.pubads().disableInitialLoad();
			let procFunc = () => {
				top.__cmp('getVendorConsents', [CONST_DFP_ID], function (result) {
					resolve();
					DFP_CONSENTS_VALUE = result.vendorConsents[CONST_DFP_ID];
					googletag.cmd.push(function () {
						googletag.pubads().setRequestNonPersonalizedAds(DFP_CONSENTS_VALUE ? 0 : 1);
					});

				});
			};
			if (cmp && cmp.cmpReady)
				procFunc();
			else
				top.__cmp('addEventListener', 'cmpReady', procFunc);
		});
	};


	// Fetch the current vendor consent before initializing
	return Promise.all([
		readVendorConsentCookie(),
		fetchPubVendorList()
	])
		.then(([vendorConsentData, pubVendorsList]) => {
			const {vendors} = pubVendorsList || {};

			const pubConsentData = readPublisherConsentCookie();
			// Check config for allowedVendorIds then the pubVendorList
			const {allowedVendorIds: configVendorIds} = config;
			const allowedVendorIds = configVendorIds instanceof Array && configVendorIds.length ? configVendorIds :
				vendors && vendors.map(vendor => vendor.id);

			// Render the UI

			const App = require('../components/app').default;


			// Initialize the store with all of our consent data
			const store = new Store({
				cmpVersion: CMP_VERSION,
				cmpId: CMP_ID,
				cookieVersion: COOKIE_VERSION,
				vendorConsentData,
				publisherConsentData: pubConsentData,
				pubVendorsList,
				allowedVendorIds,
				config
			});

			if (vendorConsentData === undefined) {
				top.__cmp('showConsentTool');
			}
			else {
				let pubCookieVersion = readCookie(COOKIE_VERSION_COOKIE_NAME);
				if (pubCookieVersion === undefined) {
					top.__cmp('showConsentTool');
				}
				else {
					if (parseInt(pubCookieVersion, 10) < config.cookieVersion)
						top.__cmp('showConsentTool');
				}
			}
			// Pull queued command from __cmp stub
			const {commandQueue = []} = window[CMP_GLOBAL_NAME] || {};

			// Replace the __cmp with our implementation
			cmp = new Cmp(store);

			// Expose `processCommand` as the CMP implementation
			window[CMP_GLOBAL_NAME] = cmp.processCommand;
			cmp.commandQueue = commandQueue;
			// Notify listeners that the CMP is loaded
			log.debug(`Successfully loaded CMP version: ${pack.version} in ${Date.now() - startTime}ms`);
			cmp.isLoaded = true;
			cmp.notify('isLoaded');

			// Render the UI
			let checkLoad = () => {
				if (document.body) {
					render(<App cmp={cmp} store={store} theme={config.theme} notify={cmp.notify}/>, document.body);
					cmp.processCommandQueue();
				}
				else
					window.requestAnimationFrame(checkLoad);
			};
			checkLoad();


			// Execute any previously queued command


			// Request lists
			return Promise.all([
				fetchGlobalVendorList().then(store.updateVendorList),
				fetchPurposeList().then(store.updateCustomPurposeList)
			]).then(() => {
				cmp.cmpReady = true;
				cmp.notify('cmpReady');
			}).catch(err => {
				log.error('Failed to load lists. CMP not ready', err);
			});
		})
		.catch(err => {
			log.error('Failed to load CMP', err);
		});
}
