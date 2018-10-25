import {h, Component} from 'preact';
import style from './modalBanner.less';
import Label from '../label/label';
import Panel from '../panel/panel';
import ChevronIcon from '../chevronicon/chevronicon';

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'banner'
	};
}

const PANEL_COLLECTED = 0;
const PANEL_PURPOSE = 1;

export default class ModalBanner extends Component {

	constructor(props) {

		super(props);
		this.state = {
			isExpanded: false,
			selectedPanelIndex: null,
		};
	}

	handleInfo = (index) => () => {
		if (index == this.state.selectedPanelIndex) {
			this.setState({isExpanded: false, selectedPanelIndex: null});
		}
		else {
			const {isExpanded, selectedPanelIndex} = this.state;
			this.setState({
				selectedPanelIndex: index,
				isExpanded: index !== selectedPanelIndex || !isExpanded
			});
		}
	};

	handleWindowClick = e => {
		if (!this.bannerRef || !this.bannerRef.contains(e.target)) {
			this.props.onSave();
		}
	};

	handleLearnMore = () => {
		this.props.controller.toggleModalShowing(true);
	};


	render(props, state) {
		const {onSave, controller,store} = props;

		let callMe=function(){
			store.selectAllVendors(true);
			store.selectAllPurposes(true);
			store.selectAllCustomPurposes(true);
			controller.onSave();
		}
		const {selectedPanelIndex, isExpanded} = state;
		const {isBannerShowing, isModalShowing} = controller;
		const {
			primaryColor,
			primaryTextColor,
			backgroundColor,
			textColor,
			textLightColor,
			textLinkColor,
		} = props.theme;

		return (
			<div
				class={style.popup}
				style={{display: isBannerShowing ? 'flex' : 'none'}}
			>

				<div
					class={style.overlay}
					onClick={this.handleClose}
				/>
				<div class={style.content} id="cmp-main-message"
					 style={{backgroundColor: backgroundColor, color: textLightColor}}
				>
					<div
						class={style.message}
						ref={el => this.messageRef = el}
					>
						<div class={style.title} style={{backgroundColor: backgroundColor, color: textColor}}>
							<LocalLabel localizeKey='title'>Ads help us run this site</LocalLabel>
						</div>
						<LocalLabel localizeKey='description'>
							When you visit our site, pre-selected companies may access and use certain information on
							your device to serve relevant ads or personalized content.
						</LocalLabel>

						<div className={style.info}>
							<span class={style.learnMore}>
								<a onClick={this.handleLearnMore}><LocalLabel localizeKey='links.manage'>Learn
									More</LocalLabel>
								</a>
							</span>
							<span class={style.accept}>
								<a onClick={callMe}><LocalLabel localizeKey='links.accept'>Continue to site</LocalLabel></a>
							</span>
						</div>
						{/* <div class={style.infoData}>
							<span class={style.infoSpan}>
								<a onClick={this.handleInfo(PANEL_COLLECTED)}>
									<ChevronIcon
										class={[style.expand, selectedPanelIndex === PANEL_COLLECTED && isExpanded ? style.expanded : ''].join(' ')}/>
								</a>
								<LocalLabel localizeKey='links.data.title'>Information that may be used.</LocalLabel>
							</span>
							<span class={style.infoSpan}>
								<a onClick={this.handleInfo(PANEL_PURPOSE)}>
									<ChevronIcon
										class={[style.expand, selectedPanelIndex === PANEL_PURPOSE && isExpanded ? style.expanded : ''].join(' ')}/>
								</a>
								<LocalLabel
									localizeKey='links.purposes.title'>Purposes for storing information.</LocalLabel>
							</span>
						</div> */}
					</div>

					{/*<Panel
						selectedIndex={selectedPanelIndex}
						class={style.infoExpanded}>
						<div class={style.infoExpanded}>
							<LocalLabel localizeKey='links.data.description'>
								Information that may be used:
								<ul>
									<li>Type of browser and its settings</li>
									<li>Information about the device's operating system</li>
									<li>Cookie information</li>
									<li>Information about other identifiers assigned to the device</li>
									<li>The IP address from which the device accesses a client's website or mobile application</li>
									<li>Information about the user's activity on that device, including web pages and mobile apps visited or used</li>
									<li>Information about the geographic location of the device when it accesses a website or mobile application</li>
								</ul>
							</LocalLabel>
						</div>
						<div class={style.infoExpanded}>
							<LocalLabel localizeKey='links.purposes.description'>
								How information may be used:
								<ul>
									<li>Storage and access of information</li>
									<li>Ad selection and delivery</li>
									<li>Content selection and delivery</li>
									<li>Personalization</li>
									<li>Measurement</li>
								</ul>
							</LocalLabel>
						</div>
					</Panel>*/}
				</div>
			</div>
		);
	}
}
