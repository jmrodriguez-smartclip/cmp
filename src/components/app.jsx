import { h, Component } from 'preact';
import style from './app.less';
import { SECTION_PURPOSES, SECTION_VENDORS } from './popup/details/details';
import Popup from './popup/popup';
import Banner from './banner/banner';
import ModalBanner from './modalBanner/modalBanner';
import config from '../lib/config';

export default class App extends Component {
	static defaultProps = {
		theme: {}
	};

	constructor(props) {

		super(props);
		props.cmp.setApp(this);
	}
	state = {
		store: this.props.store,
		selectedDetailsPanelIndex: SECTION_PURPOSES,
		visitedPurposes: {},
	};
	isConsentToolShowing = false;
	isBannerShowing = false;

	onSave = () => {
		const { store, notify } = this.props;
		store.persist();
		notify('onSubmit');
		this.toggleConsentToolShowing(false);
	};


	onChangeDetailsPanel = panelIndex => {
		this.props.store.toggleModalShowing(true);
		this.setState({
			selectedDetailsPanelIndex: Math.max(0, panelIndex)
		});
	};

	onSelectPurpose = purposeItem => {
		const { visitedPurposes } = this.state;
		const { store } = this.props;
		const {
			selectAllVendors,
			vendorConsentData: { created }
		} = store;

		// If this is the user's first visit according to their cookie data
		// our workflow is to default all vendor consents to disallow for
		// each purpose they inspect.
		if (!created &&
			!visitedPurposes[purposeItem.id]) {
			selectAllVendors(false, purposeItem.id);
		}
		this.setState({
			visitedPurposes: {
				...visitedPurposes,
				[purposeItem.id]: true
			}
		});

		store.toggleModalShowing(true);
		this.setState({
			selectedPurposeDetails: purposeItem,
			selectedDetailsPanelIndex: SECTION_VENDORS
		});
	};

	updateState = (store) => {
		this.setState({ store });
	};

	componentWillMount() {
		const { store } = this.props;
		store.subscribe(this.updateState);
	}

	toggleConsentToolShowing = (isShown) => {

		this.isBannerShowing = typeof isShown === 'boolean' ? isShown : !this.isBannerShowing;
		this.isModalShowing = false;
		this.isFooterShowing = false;
		this.state.store.storeUpdate();
	};

	toggleModalShowing = (isShown) => {
		this.isBannerShowing = false;
		this.isModalShowing = typeof isShown === 'boolean' ? isShown : !this.isModalShowing;
		this.state.store.storeUpdate();
	};

	toggleFooterShowing = (isShown) => {
		this.isFooterShowing = typeof isShown === 'boolean' ? isShown : !this.isFooterShowing;
		this.isModalShowing = false;
		this.storeUpdate();
	};


	render(props, state) {

		const {
			store,
			selectedDetailsPanelIndex,
			selectedPurposeDetails,
		} = state;
		const {
			theme,
		} = props;

		const {
			isModalShowing,
			isBannerShowing,
			toggleModalShowing,
			vendorList = {},
		} = store;

		const { purposes = [] } = vendorList;

		return (
			<div class={style.gdpr}>
				{config.uimode=="modal" ? <ModalBanner isShowing={isBannerShowing}
													   controller={this}
													   store={store}
						isModalShowing={isModalShowing}
						onSave={this.onSave}
						onShowModal={toggleModalShowing}
						onSelectPurpose={this.onSelectPurpose}
						onChangeDetailsPanel={this.onChangeDetailsPanel}
						theme={theme}
						purposes={purposes}
						selectedPurposeDetails={selectedPurposeDetails}/>
					:
					<Banner isShowing={isBannerShowing}
								 isModalShowing={isModalShowing}
								 onSave={this.onSave}
								 onShowModal={toggleModalShowing}
								 onSelectPurpose={this.onSelectPurpose}
								 onChangeDetailsPanel={this.onChangeDetailsPanel}
								 theme={theme}
								 purposes={purposes}
								 selectedPurposeDetails={selectedPurposeDetails}
					/>}
				<Popup store={store}
					   onSave={this.onSave}
					   onChangeDetailsPanel={this.onChangeDetailsPanel}
					   onSelectPurpose={this.onSelectPurpose}
					   selectedDetailsPanelIndex={selectedDetailsPanelIndex}
					   theme={theme}
					   selectedPurposeDetails={selectedPurposeDetails}
					   controller={this}
				/>
			</div>
		);
	}
}
