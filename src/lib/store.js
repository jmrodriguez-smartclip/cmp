import {writePublisherConsentCookie, writeVendorConsentCookie, writeCookie} from "./cookie/cookie";
import config from './config';
import { findLocale } from './localize';
import {fetchPubVendorList} from "./vendor";
import {COOKIE_VERSION_COOKIE_NAME} from "init";
/**
 * Copy a data object and make sure to replace references
 * of Set objects with new ones.
 */
function copyData(dataObject) {
	if (typeof dataObject !== 'object') {
		return dataObject;
	}
	const copy = {...dataObject};
	for (let key in copy) {
		if (copy.hasOwnProperty(key) && copy[key] instanceof Set) {
			copy[key] = new Set(copy[key]);
		}
	}
	return copy;
}

export const MIN_CUSTOM_VENDOR_ID = 10000;

export default class Store {
	constructor({
		cmpId = 1,
		cmpVersion = 1,
		cookieVersion = 1,
		vendorConsentData,
		publisherConsentData,
		vendorList,
		customPurposeList,
		pubVendorsList,
		allowedVendorIds
	} = {}) {
		// Keep track of data that has already been persisted
		this.persistedVendorConsentData = copyData(vendorConsentData);
		this.persistedPublisherConsentData = copyData(publisherConsentData);
		this.customVendors = [];
		this.customVendorsEnabled = new Set();
		this.filteredPublisherPurposes = [];


		this.vendorConsentData = Object.assign(
			{
				selectedPurposeIds: new Set(),
				selectedVendorIds: new Set()
			},
			vendorConsentData,
			{
				cookieVersion,
				cmpId,
				cmpVersion,
				consentLanguage: findLocale().substr(0, 2).toUpperCase()
			});

		this.publisherConsentData = Object.assign(
			{
				selectedCustomPurposeIds: new Set()
			},
			publisherConsentData,
			{
				cookieVersion,
				cmpId
			});

		this.pubVendorsList = pubVendorsList;
		this.allowedVendorIds = new Set(allowedVendorIds);

		this.statistics = {};
		this.updateVendorList(vendorList);
		this.updateCustomPurposeList(customPurposeList);
	}

	/**
	 * Build vendor consent object from data that has already been persisted. This
	 * list will only return consent=true for vendors that exist in the current
	 * vendorList.
	 */
	getVendorConsentsObject = (vendorIds) => {
		const {
			vendorList = {},
			persistedVendorConsentData = {},
			pubVendorsList = {},
			allowedVendorIds,
		} = this;

		const {
			publisherVendorsVersion,
			globalVendorListVersion
		} = pubVendorsList;

		const {
			cookieVersion,
			created,
			lastUpdated,
			cmpId,
			cmpVersion,
			consentScreen,
			consentLanguage,
			vendorListVersion,
			maxVendorId = 0,
			selectedVendorIds = new Set(),
			selectedPurposeIds = new Set()
		} = persistedVendorConsentData;

		const {purposes = [], vendors = []} = vendorList;

		// Map requested vendorIds
		const vendorMap = {};
		if (vendorIds && vendorIds.length) {
			vendorIds.forEach(id => vendorMap[id] = (selectedVendorIds.has(id) || (id >= MIN_CUSTOM_VENDOR_ID) && (allowedVendorIds.has(id) || this.customVendorsEnabled.has(id))));
		}
		else {
			// In case the vendor list has not been loaded yet find the highest
			// vendor ID to map any consent data we already have
			const lastVendorId = Math.max(maxVendorId,
				...vendors.map(({id}) => id),
				...Array.from(selectedVendorIds));

			// Map all IDs up to the highest vendor ID found
			for (let i = 1; i <= lastVendorId; i++) {
				vendorMap[i] = selectedVendorIds.has(i) && (!allowedVendorIds.size || allowedVendorIds.has(i));
			}
		}

		// Map all purpose IDs
		const lastPurposeId = Math.max(
			...purposes.map(({id}) => id),
			...Array.from(selectedPurposeIds));

		const purposeMap = {};
		for (let i = 1; i <= lastPurposeId; i++) {
			purposeMap[i] = selectedPurposeIds.has(i);
		}

		return {
			cookieVersion,
			created,
			lastUpdated,
			cmpId,
			cmpVersion,
			consentScreen,
			consentLanguage,
			publisherVendorsVersion,
			globalVendorListVersion,
			vendorListVersion,
			maxVendorId,
			purposeConsents: purposeMap,
			vendorConsents: vendorMap
		};
	};

	/**
	 * Build publisher consent object from data that has already been persisted.
	 * Purposes will only have consent=true if they exist in the current vendorList.
	 */
	getPublisherConsentsObject = () => {
		const {
			vendorList = {},
			customPurposeList = {},
			persistedPublisherConsentData = {},
			persistedVendorConsentData = {}
		} = this;

		const {
			cookieVersion,
			created,
			lastUpdated,
			cmpId,
			vendorListVersion,
			publisherPurposeVersion,
			selectedCustomPurposeIds = new Set()
		} = persistedPublisherConsentData;

		const {selectedPurposeIds = new Set()} = persistedVendorConsentData;
		const {purposes = []} = vendorList;
		const {purposes: customPurposes = []} = customPurposeList;

		const lastStandardPurposeId = Math.max(
			...purposes.map(({id}) => id),
			...Array.from(selectedPurposeIds));

		const lastCustomPurposeId = Math.max(
			...customPurposes.map(({id}) => id),
			...Array.from(selectedPurposeIds));

		// Map all purpose IDs
		const standardPurposeMap = {};
		for (let i = 1; i <= lastStandardPurposeId; i++) {
			standardPurposeMap[i] = selectedPurposeIds.has(i);
		}
		const customPurposeMap = {};
		for (let i = 1; i <= lastCustomPurposeId; i++) {
			customPurposeMap[i] = selectedCustomPurposeIds.has(i);
		}

		return {
			cookieVersion,
			created,
			lastUpdated,
			cmpId,
			vendorListVersion,
			publisherPurposeVersion,
			standardPurposes: standardPurposeMap,
			customPurposes: customPurposeMap
		};
	};


	/**
	 * Persist all consent data to the cookie.  This data will NOT be filtered
	 * by the vendorList and will include global consents set no matter what
	 * was allowed by the list.
	 */
	persist = () => {
		const {
			vendorConsentData,
			publisherConsentData,
			vendorList,
			customPurposeList
		} = this;

		const {
			vendorListVersion = 1
		} = vendorList || {};
		// Se escribe la cookie de la version de cookie
		writeCookie(COOKIE_VERSION_COOKIE_NAME, config.cookieVersion, 365 * 24 * 60 * 60);

		// Update modification dates and write the cookies
		const now = new Date();
		vendorConsentData.created = vendorConsentData.created || now;
		vendorConsentData.lastUpdated = now;

		// Update version of list to one we are using
		vendorConsentData.vendorListVersion = vendorListVersion;
		publisherConsentData.vendorListVersion = vendorListVersion;

		publisherConsentData.created = publisherConsentData.created || now;
		publisherConsentData.lastUpdated = now;

		// Write vendor cookie to appropriate domain
		writeVendorConsentCookie({...vendorConsentData, vendorList});

		// Write publisher cookie if enabled
		if (config.storePublisherData) {
			writePublisherConsentCookie({
				...vendorConsentData,
				...publisherConsentData,
				vendorList,
				customPurposeList
			});
		}

		// Store the persisted data
		this.persistedVendorConsentData = copyData(vendorConsentData);
		this.persistedPublisherConsentData = copyData(publisherConsentData);

		// Notify of date changes
		this.storeUpdate();
	};

	listeners = new Set();

	subscribe = (callback) => {
		this.listeners.add(callback);
	};

	unsubscribe = (callback) => {
		this.listeners.delete(callback);
	};

	storeUpdate = () => {
		this.listeners.forEach(callback => callback(this));
	};

	selectVendor = (vendorId, isSelected) => {
		if (vendorId < MIN_CUSTOM_VENDOR_ID) {
			const {selectedVendorIds} = this.vendorConsentData;
			if (isSelected) {
				selectedVendorIds.add(vendorId);
			}
			else {
				selectedVendorIds.delete(vendorId);
			}
		}
		else {
			let found = this.customVendors.filter((item) => item.vendorId == vendorId);
			if (found.length == 1) {
				// Recuperamos el id original, que esta copiado en _id
				this.selectCustomPurpose(found[0]._id, isSelected);
			}
		}
		this.storeUpdate();

	};

	selectAllVendors = (isSelected,byPurpose = null) => {

		const {vendors = []} = this.vendorList || {};
		const operation = isSelected ? 'add' : 'delete';
		if (byPurpose != null)
			this.vendorConsentData.selectedPurposeIds[operation](byPurpose.id);

		vendors.forEach((vendor) => {
			if (byPurpose==null || (vendor.purposeIds && vendor.purposeIds.indexOf(byPurpose.id)>=0)) {
				this.vendorConsentData.selectedVendorIds[operation](vendor.id);
			}
		});

		this.customVendors.map((item) => this.selectCustomPurpose(item._id, isSelected));
		this.storeUpdate();
	};


	selectPurpose = (purposeId, isSelected) => {

		const {selectedPurposeIds} = this.vendorConsentData;

		if (isSelected) {
			selectedPurposeIds.add(purposeId);
		}
		else {
			selectedPurposeIds.delete(purposeId);
		}
		this.storeUpdate();
	};

	selectAllPurposes = (isSelected) => {
		const {purposes = []} = this.vendorList || {};
		const operation = isSelected ? 'add' : 'delete';
		purposes.forEach(({id}) => this.vendorConsentData.selectedPurposeIds[operation](id));
		this.storeUpdate();
	};

	selectCustomPurpose = (purposeId, isSelected) => {
		const {selectedCustomPurposeIds} = this.publisherConsentData;
		let found = this.customPurposeList.purposes.filter((item) => {
			return (item._id == purposeId || item.id == purposeId);
		});
		if (found.length == 0)
			return;
		let op = isSelected ? "add" : "delete";

		selectedCustomPurposeIds[op](purposeId);
		if (found[0].type == "vendor")
			this.customVendorsEnabled[op](found[0].vendorId);

		this.storeUpdate();
	};

	selectAllCustomPurposes = (isSelected) => {
		const {purposes = []} = this.customPurposeList || {};
		const operation = isSelected ? 'add' : 'delete';
		purposes.forEach((obj) => {
			if (obj.type != "vendor")
				this.publisherConsentData.selectedCustomPurposeIds[operation](obj.id);

		});
		this.storeUpdate();
	};


	updateVendorList = vendorList => {

		const {
			allowedVendorIds
		} = this;

		const {
			created,
			maxVendorId = 0
		} = this.vendorConsentData;

		// Filter vendors in vendorList by allowedVendorIds
		if (vendorList && vendorList.vendors && allowedVendorIds.size) {
			vendorList.vendors = vendorList.vendors.filter(({id}) => allowedVendorIds.has(id));
		}

		const {
			vendors = [],
			purposes = [],
		} = vendorList || {};

		// If vendor consent data has never been persisted set default selected status
		if (!created) {
			this.vendorConsentData.selectedPurposeIds = new Set(purposes.map(p => p.id));
			this.vendorConsentData.selectedVendorIds = new Set(vendors.map(v => v.id));
		}

		const {selectedVendorIds = new Set()} = this.vendorConsentData;

		// Find the maxVendorId out of the vendor list and selectedVendorIds
		this.vendorConsentData.maxVendorId = Math.max(maxVendorId,
			...vendors.map(({id}) => id),
			...Array.from(selectedVendorIds));
		this.vendorList = vendorList;
		this.storeUpdate();
	};


	updateCustomPurposeList = customPurposeList => {
		const {created} = this.publisherConsentData;

		// If publisher consent has never been persisted set the default selected status
		if (!created) {
			const {purposes = [],} = customPurposeList || {};
			this.publisherConsentData.selectedCustomPurposeIds = new Set(purposes.map(p => p.id));
		}
		const consentData = this.publisherConsentData;

		const {version = 1} = customPurposeList || {};
		this.publisherConsentData.publisherPurposeVersion = version;
		this.customPurposeList = customPurposeList;
		if (customPurposeList) {
			this.filteredPublisherPurposes = customPurposeList.purposes.filter((item) => {
				if (item.type == "vendor" && parseInt(item.vendorId) >= MIN_CUSTOM_VENDOR_ID) {
					// Se sobreescribe el id con el vendor id para hacer mas facil el resto del código.
					// Esto luego hay que gestionarlo al escribir o leer los customPurposes.
					item._id = item.id;
					//item.id=item.vendorId;
					this.customVendors.push(item);
					if (consentData.selectedCustomPurposeIds.has(item.id))
						this.customVendorsEnabled.add(parseInt(item.vendorId));
					return false;
				}
				return true;
			});

		}
		this.storeUpdate();
	};
}
