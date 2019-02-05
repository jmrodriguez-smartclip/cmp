import {h, Component} from 'preact';
import style from './summary.less';
import detailsStyle from '../details.less';
import Label from "../../../label/label";
import Button from "../../../button/button";
import Switch from '../../../switch/switch';
import QuestionIcon from '../../../questionicon/questionicon';
import config from '../../../../lib/config';
import {Localize} from '../../../../lib/localize';

class SummaryLabel extends Label {
	static defaultProps = {
		prefix: 'summary'
	};
}

class PurposesLabel extends Label {
	static defaultProps = {
		prefix: 'purposes'
	};
}

export default class Summary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedPurposes: this.props.store.selectedPurposeIds,
			selectedCustomPurposes: this.props.store.publisherConsentData.selectedCustomPurposeIds,
			selectedHelp: 0
		};
	}


	static defaultProps = {
		vendors: [],
	};


	handlePurposeItemClick = purposeItem => {
		return () => {
			this.props.onPurposeClick(purposeItem);
		};
	};

	/* Test 2*/
	handlePurposeChange = (customPurpose) => {
		return (dataId, isSelected) => {
			this.props.store.selectAllVendors(isSelected, customPurpose);
			//this.props.store.selectPurpose(customPurpose,isSelected);
		};
	};
	handleCustomPurposeChange = (customPurpose) => {
		return (dataId, isSelected) => {
			this.props.store.selectCustomPurpose(customPurpose.id, isSelected);
		};
	};
	handleHelpClick = (purpose) => {
		return () => {
			if (this.state.selectedHelp === purpose.helpIndex)
				this.setState({selectedHelp: 0});
			else
				this.setState({selectedHelp: purpose.helpIndex});
		};
	};


	renderCustomPurposes(props, customPurposes) {
		if (customPurposes.length == 0)
			return <span/>;
		const {
			textColor,
			dividerColor,
			textLinkColor,
			textLightColor
		} = props.theme;
		return (
			<div>
				<div className={detailsStyle.description}>
					<SummaryLabel localizeKey='customPurposesDescription' style={{color: textColor}}>
						Our site may also need to use personal information for the following purposes:
					</SummaryLabel>
				</div>

				<div className={style.customPurposes}>
					{customPurposes.map((item) => (
						<div>
							<div class={style.purposeItem}>
								<span className={style.purposeTitle} style={{color: textLightColor}}>
									{item.name}
								</span>
								<span>
									<Switch
										dataId={item.id}
										isSelected={this.props.store.publisherConsentData.selectedCustomPurposeIds.has(item.id)}
										onClick={this.handleCustomPurposeChange(item)}
									/>
									<a onClick={this.handleHelpClick(item)}><QuestionIcon
										color={this.state.selectedHelp === item.helpIndex ? textLinkColor : textColor}/></a>
								</span>
							</div>
							<div
								className={[style.help, this.state.selectedHelp === item.helpIndex ? style.expandedHelp : ''].join(' ')}>
								{item.help}<br/><br/>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	render(props, state) {
		const {
			purposes,
			customPurposes,
			onVendorListClick,
			onPurposeListClick,
			theme
		} = props;


		const {
			textColor,
			dividerColor,
			textLinkColor
		} = theme;
		const lookup = new Localize();
		let idx = 0;
		purposes.map((purposeItem) => {
			idx++;
			purposeItem.help = lookup.lookup("purposes.purpose" + (idx) + ".description");
			purposeItem.helpIndex = idx;
		});
		customPurposes.map((purposeItem) => {
			idx++;
			purposeItem.help = purposeItem.description;
			purposeItem.helpIndex = idx;
		});

		return (
			<div class={style.summary}>
				<div class={detailsStyle.title} style={{color: textColor}}>
					<SummaryLabel localizeKey='title'>Learn more about how information is being used?</SummaryLabel>
				</div>
				<div class={detailsStyle.description}>
					<SummaryLabel localizeKey='description'>
						We and select companies may access and use your information for the below purposes. You may
						customize your choices below or continue using our site if you're OK with the purposes.
					</SummaryLabel>
				</div>
				<div className={style.purposeItems}>
					{purposes.map((purposeItem, index) => (
						<div>
							<div className={style.purposeItem} style={{borderColor: dividerColor}}>
								<span className={style.purposeTitle}>
									<a onClick={this.handlePurposeItemClick(purposeItem)}
									   style={{color: textLinkColor}}>
										<PurposesLabel
											localizeKey={`purpose${purposeItem.id}.menu`}>{purposeItem.name}</PurposesLabel>
									</a>


								</span>
								<span>
									<Switch
										dataId={purposeItem.id}
										isSelected={this.props.store.vendorConsentData.selectedPurposeIds.has(purposeItem.id)}
										onClick={this.handlePurposeChange(purposeItem)}/>
									<a onClick={this.handleHelpClick(purposeItem)}><QuestionIcon
										color={this.state.selectedHelp === purposeItem.helpIndex ? textLinkColor : textColor}/></a>
								</span>
							</div>
							<div
								class={[style.help, this.state.selectedHelp === purposeItem.helpIndex ? style.expandedHelp : ''].join(' ')}>
								{purposeItem.help}<br/><br/>
							</div>
						</div>
					))}
				</div>
				{this.renderCustomPurposes(props, customPurposes)}

			</div>
		);
	}
}
