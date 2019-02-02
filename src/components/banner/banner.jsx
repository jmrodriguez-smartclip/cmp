import { h, Component } from 'preact';
import style from './banner.less';
import Label from '../label/label';
import Panel from '../panel/panel';
import ChevronIcon from '../chevronicon/chevronicon';
import config from "../../lib/config";

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'banner'
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
		this.props.onShowModal(true);
	};


	render(props, state) {
		const {controller, isShowing, onSave, theme} = props;

		const {
			primaryColor,
			primaryTextColor,
			backgroundColor,
			textColor,
			textLightColor,
			textLinkColor,
		} = theme;
		const {selectedPanelIndex, bannerBottom, isExpanded} = state;
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
							<div class="{style.messageContent}">
							<LocalLabel localizeKey='description'>
								When you visit our site, pre-selected companies may access and use certain information
								on your device to serve relevant ads or personalized content.
							</LocalLabel>
							</div>

						</div>
						<div className={style.links}>
							<span className={style.learnMore}>
								<a className={style.bannerLink} onClick={this.handleLearnMore}><LocalLabel localizeKey='links.manage'>Learn
									More</LocalLabel>
								</a>
							</span>
							<span className={style.accept}>
								<a className={style.bannerLink} onClick={callMe}><LocalLabel localizeKey='links.accept'>Continue to site</LocalLabel></a>
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
