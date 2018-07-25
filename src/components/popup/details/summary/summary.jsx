import { h, Component } from 'preact';
import style from './summary.less';
import detailsStyle from '../details.less';
import Label from "../../../label/label";
import Button from "../../../button/button";
import Switch from '../../../switch/switch';
import config from '../../../../lib/config';

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

export default class VendorList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedPurposes: this.props.store.selectedPurposeIds,
			selectedCustomPurposes: this.props.store.publisherConsentData.selectedCustomPurposeIds
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
		};
	};
	handleCustomPurposeChange = (customPurpose) => {
		return (dataId, isSelected) => {
			this.props.store.selectCustomPurpose(customPurpose.id, isSelected);
		};
	};

	renderCustomPurposes(customPurposes) {
		if (customPurposes.length == 0)
			return <span/>;
		return (
			<div class={style.purposeItems}>
				{customPurposes.map((item) => (
					<div class={style.purposeItem}>
						<span className={style.purposeTitle}>
							{item.name}
						</span>
						<Switch
							dataId={item.id}
							isSelected={this.props.store.publisherConsentData.selectedCustomPurposeIds.has(item.id)}
							onClick={this.handleCustomPurposeChange(item)}
						/>
					</div>
				))}
			</div>
		);
	}
	render(props, state)
	{
		const {
			purposes,
			customPurposes
		} = props;


		return (
			<div class={style.summary}>
				<div class={detailsStyle.title}>
					<SummaryLabel localizeKey='title'>Learn more about how information is being used?</SummaryLabel>
				</div>
				<div class={detailsStyle.description}>
					<SummaryLabel localizeKey='description'>
					We and select companies may access and use your information for the below purposes. You may
					customize your choices below or continue using our site if you're OK with the purposes.
					</SummaryLabel>
				</div>
				<div class={style.purposeItems}>
					{purposes.map((purposeItem, index) => (
						<div class={style.purposeItem}>
							<span class={style.purposeTitle}>
								<a onClick={this.handlePurposeItemClick(purposeItem)}>
									<PurposesLabel
										localizeKey={`purpose${purposeItem.id}.menu`}>{purposeItem.name}</PurposesLabel>
								</a>
							</span>
							<Switch
								dataId={purposeItem.id}

								isSelected={this.props.store.vendorConsentData.selectedPurposeIds.has(purposeItem.id)}
								onClick={this.handlePurposeChange(purposeItem)}
							/>
						</div>
					))}
				</div>
				{this.renderCustomPurposes(customPurposes)}

			</div>
		);
	}
}
