import React, { Component } from 'react';
import { Header, Label, Input, Grid, Form, Button } from 'semantic-ui-react';
import Isemail from 'isemail';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import axios from 'axios';

class Register extends Component {
	state = {
		formErrors: {}
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		const email = trim(this.email.inputRef.current.value);
		const password = this.password.inputRef.current.value;
		const password2 = this.password2.inputRef.current.value;

		let formErrors = {};
		// validation
		if (email === '') {
			formErrors.email = 'Please enter your email';
		} else if (!Isemail.validate(email)) {
			formErrors.email = 'Please enter a valid email';
		}
		if (password.length < 6) {
			formErrors.password = 'Password must be at least 6 characters';
		}
		if (password === '') {
			formErrors.password = 'Please enter a password';
		}
		if (password !== password2) {
			formErrors.password2 = 'Please confirm your password';
		}

		if (!isEmpty(formErrors)) {
			this.setState({ formErrors });
			return;
		}

		const userData = { email, password, password2 };

		try {
			await axios.post('/api/users/register', userData);
			this.props.history.push('/login');
		} catch (resErr) {
			console.log('resErr', resErr.response);
			// server validation failed, email already exists
			formErrors = resErr.response.data;
			this.setState({ formErrors });
		}
	};

	render() {
		return (
			<Grid centered>
				<Grid.Row>
					<Grid.Column mobile={16} tablet={8}>
						<Header textAlign="center" as="h1">
							Sign up
						</Header>
						<Form noValidate onSubmit={this.handleSubmit}>
							<Form.Field error={!!this.state.formErrors.email}>
								<label>Email</label>
								<Input
									ref={(input) => (this.email = input)}
									icon="user"
									iconPosition="left"
									placeholder="Email"
								/>
								{!!this.state.formErrors.email && <Label pointing>{this.state.formErrors.email}</Label>}
							</Form.Field>
							<Form.Field error={!!this.state.formErrors.password}>
								<label>Password</label>
								<Input
									ref={(input) => (this.password = input)}
									type="password"
									icon="lock"
									iconPosition="left"
									placeholder="Password"
								/>
								{!!this.state.formErrors.password && (
									<Label pointing>{this.state.formErrors.password}</Label>
								)}
							</Form.Field>
							<Form.Field error={!!this.state.formErrors.password2}>
								<label>Confirm Password</label>
								<Input
									ref={(input) => (this.password2 = input)}
									type="password"
									icon="lock"
									iconPosition="left"
									placeholder="Password"
								/>
								{!!this.state.formErrors.password2 && (
									<Label pointing>{this.state.formErrors.password2}</Label>
								)}
							</Form.Field>
							<Button>Sign-up</Button>
						</Form>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

export default Register;
