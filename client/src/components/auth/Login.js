import React, { Component } from 'react';
import { Header, Label, Input, Grid, Form, Button } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import axios from 'axios';
import { login } from '../../actions/auth';

class Login extends Component {
	state = {
		formErrors: {}
	};

	handleSubmit = async (e) => {
		e.preventDefault();

		const email = trim(this.email.inputRef.current.value);
		const password = this.password.inputRef.current.value;
		// vaildate form
		let formErrors = {};

		if (email === '') {
			formErrors.email = 'Please enter your email';
		}
		// this is fail server side anyway
		// else if (!Isemail.validate(email)) {
		// 	formErrors.email = 'Please enter a valid email';
		// }

		if (password === '') {
			formErrors.password = 'Please enter a password';
		}
		if (!isEmpty(formErrors)) {
			this.setState({ formErrors });
			return;
		}

		const userData = { email, password };

		try {
			const res = await axios.post('/api/users/login', userData);
			login(res.data.token);
		} catch (resErr) {
			console.log('resErr', resErr);
			console.log('resErr.response', resErr.response);
			// server validation failed, email already exists
			formErrors = resErr.response.data;
			// this.setState({ formErrors });
			this.setState({ formErrors });
		}
	};

	render() {
		return (
			<Grid centered>
				<Grid.Row>
					<Grid.Column mobile={16} tablet={8}>
						<Header textAlign="center" as="h1">
							Sign in
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
							<Button>Sign-in</Button>
						</Form>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

export default Login;
