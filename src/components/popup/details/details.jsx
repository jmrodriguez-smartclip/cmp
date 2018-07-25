import { h, Component } from 'preact';
import style from './details.less';
import Button from '../../button/button';
import Vendors from './vendors/vendors';
import VendorList from './vendorList/vendorList';
import Summary from './summary/summary';
import Panel from '../../panel/panel';
import PurposeList from './purposeList/purposeList';
import Label from "../../label/label";

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'details'
	};
}

const SECTION_PURPOSES = 0;
const SECTION_VENDOR_LIST = 1;
const SECTION_PURPOSE_LIST = 2;
const SECTION_VENDORS = 3;

export default class Details extends Component {
	state = {
		selectedPanelIndex: SECTION_PURPOSES
	};

	handlePanelClick = panelIndex => {
		return () => {
			this.setState({
				selectedPanelIndex: Math.max(0, panelIndex)
			});
		};
	};

	handleBack = () => {
		this.setState({
			selectedPanelIndex: SECTION_PURPOSES
		});
	};

	handlePurposeClick = purposeItem => {

		this.setState({
			selectedPurpose: purposeItem,
			selectedPanelIndex: SECTION_VENDORS
		});
	};


	render(props, state) {
		const {
			onSave,
			onClose,
			store,
		} = props;
		const {
			selectedPanelIndex,
			selectedPurpose
		} = state;

		const {
			vendorList = {},
			customPurposeList = {},
			vendorConsentData,
			publisherConsentData,
			selectPurpose,
			selectCustomPurpose,
			selectAllVendors,
			selectVendor
		} = store;
		const {selectedPurposeIds, selectedVendorIds} = vendorConsentData;
		const {selectedCustomPurposeIds} = publisherConsentData;
		const {purposes = [], vendors = []} = vendorList;
		const {purposes: customPurposes = []} = customPurposeList;

		const formattedVendors = vendors
			.map(vendor => ({
				...vendor,
				policyUrl: vendor.policyUrl.indexOf('://') > -1 ? vendor.policyUrl : `http://${vendor.policyUrl}`
			}));

		// Se duplican los custom vendors, para hacer que el id sea el vendorId, pero solo en la copia (no en el original)
		store.customVendors.map(cVendor => {
			let nv = {};
			for (let k in cVendor)
				nv[k] = cVendor[k];
			nv.id = cVendor.vendorId;
			formattedVendors.push(nv);
		});
		formattedVendors.sort(({name: n1}, {name: n2}) => n1.toLowerCase() === n2.toLowerCase() ? 0 : n1.toLowerCase() > n2.toLowerCase() ? 1 : -1);

		let mergedSelection = new Set(selectedVendorIds);
		store.customVendorsEnabled.forEach((v) => mergedSelection.add(v));


		return (
			<div class={style.details}>
				<div class={style.body}>
					<Panel selectedIndex={selectedPanelIndex}>
						<Summary
							purposes={purposes}
							customPurposes={props.store.filteredPublisherPurposes}
							store={store}
							onPurposeClick={this.handlePurposeClick}
							onVendorListClick={this.handlePanelClick(SECTION_VENDOR_LIST)}
							onPurposeListClick={this.handlePanelClick(SECTION_PURPOSE_LIST)}
						/>
						<VendorList
							vendors={formattedVendors}
							onBack={this.handleBack}
						/>
						<PurposeList
							onBack={this.handleBack}
						/>
						<Vendors
							vendors={formattedVendors}
							purposes={purposes}
							selectVendor={selectVendor}
							selectAllVendors={selectAllVendors}
							selectedVendorIds={mergedSelection}
							selectedPurpose={selectedPurpose}
							store={store}

						/>
					</Panel>
				</div>
				<div class={style.footer}>
					{selectedPanelIndex > 0 &&
					<Button class={style.back} onClick={this.handleBack}>&lt; <LocalLabel localizeKey='back'>Back</LocalLabel></Button>
					}
					<Button class={(selectedPanelIndex == 0 && style.save_full) || style.save}
							onClick={onSave}><LocalLabel localizeKey='save'>Continue Using Site</LocalLabel></Button>
				</div>
			</div>
		);
	}
}
