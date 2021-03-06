import { h, Component } from 'preact';
import style from './popup.less';
import Details from './details/details';
import CloseButton from '../closebutton/closebutton';

export default class Popup extends Component {

	handleClose = () => {
		//const {store} = this.props;
		//store.toggleModalShowing(false)
	};

	render(props, state) {
		const {
			store,
			onSave,
			theme,
			onChangeDetailsPanel,
			onSelectPurpose,
			selectedDetailsPanelIndex,
			selectedPurposeDetails,
			controller
		} = props;
		const {overlayBackground, secondaryColor, backgroundColor} = theme;
		const {isModalShowing} = controller;
		/*
		<CloseButton onClick={this.handleClose} stroke={secondaryColor} fill={backgroundColor} />
		 */

		return (
			<div
				class={style.popup}
				style={{display: isModalShowing ? 'flex' : 'none'}}
			>
				<div
					class={style.overlay}
					style={{background: overlayBackground}}
					onClick={this.handleClose}
				/>
				{isModalShowing ?
					<div class={style.content}>

						<Details
							onSave={onSave}
							store={store}
							onClose={this.handleClose}
							onChangeDetailsPanel={onChangeDetailsPanel}
							onSelectPurpose={onSelectPurpose}
							selectedPanelIndex={selectedDetailsPanelIndex}
							selectedPurposeDetails={selectedPurposeDetails}
							theme={theme}
						/>
					</div> : null
				}
			</div>
		);
	}
}
