import { h, Component } from 'preact';
import style from './app.less';
import Popup from './popup/popup';
import Banner from './banner/banner';
import ModalBanner from './modalBanner/modalBanner';
import config from '../lib/config';

export default class App extends Component {
	constructor(props) {

		super(props);
		props.cmp.setApp(this);
	}
	state = {
		store: this.props.store
	};
	isConsentToolShowing = false;
	isBannerShowing = false;

	onSave = () => {
		const { store, notify } = this.props;
		store.persist();
		notify('onSubmit');
		this.toggleConsentToolShowing(false);
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
		console.log("MODAL:" + config.uimode);
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
		} = state;


		return (
			<div class={style.gdpr}>
				{config.uimode ? <ModalBanner
					onSave={this.onSave}
					controller={this}
					onShowModal={this.toggleModalShowing}
				/> : <Banner
					onSave={this.onSave}
					controller={this}
					onShowModal={this.toggleModalShowing}/>
				}
				<Popup store={store} controller={this}
					   onSave={this.onSave}
				/>
			</div>
		);
	}
}
