import { h, Component } from 'preact';
import style from './banner.less';
import Label from '../label/label';
import Panel from '../panel/panel';
import ChevronIcon from '../chevronicon/chevronicon';
import config from "../../lib/config";
import { SECTION_VENDOR_LIST } from '../popup/details/details';

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'banner'
	};
}

class PurposesLabel extends Label {
	static defaultProps = {
		prefix: 'purposes'
	};
}

const PANEL_COLLECTED = 0;
const PANEL_PURPOSE = 1;

const BANNER_OFFSET = 20;

export default class Banner extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isExpanded: false,
			selectedPanelIndex: 0,
		};
	}

	handleInfo = (index) => () => {
		const { isExpanded, selectedPanelIndex } = this.state;
		this.setState({
			selectedPanelIndex: index,
			isExpanded: index !== selectedPanelIndex || !isExpanded
		});
	};

	handleWindowClick = e => {
		if (!this.bannerRef || !this.bannerRef.contains(e.target)) {
			this.props.onSave();
		}
	};

	handleLearnMore = () => {
		this.props.controller.toggleModalShowing(true);
	};

	handlePurposeItemClick = purposeItem => {
		return () => {
			this.props.onSelectPurpose(purposeItem);
		};
	};

	handleVendorListClick = () => {
		this.props.onChangeDetailsPanel(SECTION_VENDOR_LIST);
	};

	render(props, state) {
		const {controller, isShowing, onSave, theme,purposes} = props;
		const { selectedPanelIndex, isExpanded } = state;
		const {
			primaryColor,
			primaryTextColor,
			backgroundColor,
			textColor,
			textLightColor,
			textLinkColor,
		} = theme;
		const {isBannerShowing} = controller;
		let callMe=function(){
			store.selectAllVendors(true);
			store.selectAllPurposes(true);
			store.selectAllCustomPurposes(true);
			controller.onSave();
		}
		let dispositionStyle = style.banner + " " + style["banner-" + config.position];

		return (
			<div
				ref={el => this.bannerRef = el}
				class={dispositionStyle}
				style={{
					boxShadow: `0px 0px 5px ${primaryColor}`,
					backgroundColor: backgroundColor,
					color: textLightColor,
					display: isBannerShowing ? 'flex' : 'none'
				}}
			>
				<div class={style.content}>
					<div
						class={style.message}
						ref={el => this.messageRef = el}
					>
						<div class={style.info}>
							<div class={style.title} style={{ color: textColor }}>
								<LocalLabel localizeKey='title'>Ads help us run this site</LocalLabel>
							</div>
							<LocalLabel localizeKey='description'>
								We use our own cookies and third parties ones to analyse our service, measure audiences, personalise content we offer and show ads according your interests, through data we get from those cookies about your navigation habits to profile interest groups. We can use external data sources too to elaborate those interests groups and share your navigation habits and inferred interests with third parties with the same purposes of content and advertising personalization. You can accept the use of cookies or configure your preferences in the two buttons below:
							</LocalLabel>

						</div>
						<div class={style.consent}>
							<a class={style.learnMore} onClick={this.handleLearnMore}
							   style={{ color: primaryColor, borderColor: primaryColor }}>
								<LocalLabel localizeKey='links.manage'>Manage Your Choices</LocalLabel>
							</a>
							<a
								class={style.continue}
								onClick={callMe}
								style={{
									backgroundColor: primaryColor,
									borderColor: primaryColor,
									color: primaryTextColor
								}}
							>
								<LocalLabel localizeKey='links.accept'>Continue to site</LocalLabel>
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
