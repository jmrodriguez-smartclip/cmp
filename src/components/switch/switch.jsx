import { h, Component } from 'preact';
import style from './switch.less';

export default class Switch extends Component {

	static defaultProps = {
		onClick: () => {},
	};

	constructor(props) {
		super(props);
		this.state = {isSelected: props.isSelected, isDisabled: props.isDisabled};
	}
	handleClicked = () => {
		this.setState({isSelected: !this.props.isSelected}, () => {
			this.props.onClick(this.props.dataId, this.state.isSelected);
		});


	};

	shouldComponentUpdate(nextProps) {
		return nextProps.isSelected !== this.props.isSelected;
	};

	render(props) {
		const {
			color
		} = props;

		return (
			<span
				class={[style.switch, props.class, this.props.isSelected ? style.isSelected : ''].join(' ')}
				onClick={this.handleClicked.bind(this)}
			>
				<input
					checked={this.props.isSelected}
					className={style.native}
					disabled={this.state.isDisabled}
					type='checkbox'
				/>
				<span class={style.visualizationContainer}
					  style={{backgroundColor: this.props.isSelected ? color : null}}/>
				<span class={style.visualizationGlow} style={{backgroundColor: color}} />
				<span class={style.visualizationHandle} />
			</span>
		);
	}
}
