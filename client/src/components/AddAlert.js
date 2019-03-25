import React from 'react';
import { Button, Label, Header, Form, Radio } from 'semantic-ui-react';
import { connect } from 'react-redux';
import trim from 'lodash/trim';
import isEmpty from 'lodash/isEmpty';
import axios from 'axios';

class AddAlert extends React.Component {
	state = {
		formErrors: {}
	};

	alertTypeClickHandler = (e, { value }) => {
		this.setState({ alertType: value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();

		const pairing = trim(this.pairing.value.toUpperCase());
		const price = Number(trim(this.price.value));
		// validate form
		let formErrors = {};

		// validate pairing
		// check not empty
		if (pairing === '') {
			formErrors.pairing = 'Please enter a Pairing Symbol';
		}

		// validate price
		if (trim(this.price.value) === '') {
			formErrors.price = 'Please enter a Price';
		}
		// check is number
		if (isNaN(price)) {
			formErrors.price = 'Invalid Price';
		}

		// validate alertType
		if (!this.state.alertType) {
			formErrors.alertType = 'Please select alert type';
		}

		if (!isEmpty(formErrors)) {
			this.setState({ formErrors });
			return;
		}

		const alertData = {
			pairing,
			price,
			alertType: this.state.alertType
		};

		try {
			const res = await axios.post('/api/alerts/new', alertData);
			this.props.dispatch({ type: 'ALERTS_LIST_ADD', payload: res.data.alert });
			this.props.history.push('/alertslist');
		} catch (resErr) {
			console.log('resErr', resErr);
			console.log('resErr.response', resErr.response);
			// server validation failed, either, bad pairing symbol
			// or alertType + price not make sense for current price
			formErrors = resErr.response.data;
			this.setState({ formErrors });
		}
	};

	render() {
		return (
			<React.Fragment>
				<Header textAlign="center" as="h2">
					Add Alert
				</Header>
				<Form noValidate onSubmit={this.handleSubmit}>
					<Form.Field error={!!this.state.formErrors.pairing}>
						{/* TODO make this autocomplete */}
						<label>Pairing Symbol</label>
						<input ref={(input) => (this.pairing = input)} placeholder="e.g. BTCUSDT" />
						{!!this.state.formErrors.pairing && <Label pointing>{this.state.formErrors.pairing}</Label>}
					</Form.Field>
					<Form.Field error={!!this.state.formErrors.price}>
						<label>Price</label>
						<input ref={(input) => (this.price = input)} placeholder="e.g. 4000" />
						{!!this.state.formErrors.price && <Label pointing>{this.state.formErrors.price}</Label>}
					</Form.Field>
					<Form.Field error={!!this.state.formErrors.alertType}>
						<Radio
							label="Buy"
							name="radioGroup"
							value="BUY"
							checked={this.state.alertType === 'BUY'}
							onChange={this.alertTypeClickHandler}
						/>
						<Radio
							label="Sell"
							name="radioGroup"
							value="SELL"
							checked={this.state.alertType === 'SELL'}
							onChange={this.alertTypeClickHandler}
						/>
						{!!this.state.formErrors.alertType && <Label pointing>{this.state.formErrors.alertType}</Label>}
					</Form.Field>
					<Button>Add to alerts</Button>
				</Form>
			</React.Fragment>
		);
	}
}

export default connect()(AddAlert);
