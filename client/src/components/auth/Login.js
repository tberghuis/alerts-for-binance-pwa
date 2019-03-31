import React, { useState } from 'react';
import { Header, Label, Input, Grid, Form, Button } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import axios from 'axios';
import { login } from '../../actions/auth';

export default function Login({ history }) {
	const [ formErrors, setFormErrors ] = useState({});
	const [ emailRef, setEmailRef ] = useState(null);
	const [ passwordRef, setPasswordRef ] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const email = trim(emailRef.inputRef.current.value);
		const password = passwordRef.inputRef.current.value;
		// vaildate form
		let formErrors = {};

		if (email === '') {
			formErrors.email = 'Please enter your email';
		}

		if (password === '') {
			formErrors.password = 'Please enter a password';
		}
		if (!isEmpty(formErrors)) {
			setFormErrors(formErrors);
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
			setFormErrors(formErrors);
		}
	};

	return (
		<Grid centered>
			<Grid.Row>
				<Grid.Column mobile={16} tablet={8}>
					<Header textAlign="center" as="h1">
						Sign in
					</Header>
					<Form noValidate onSubmit={handleSubmit}>
						<Form.Field error={!!formErrors.email}>
							<label>Email</label>
							<Input
								ref={(input) => setEmailRef(input)}
								icon="user"
								iconPosition="left"
								placeholder="Email"
							/>
							{!!formErrors.email && <Label pointing>{formErrors.email}</Label>}
						</Form.Field>
						<Form.Field error={!!formErrors.password}>
							<label>Password</label>
							<Input
								ref={(input) => setPasswordRef(input)}
								type="password"
								icon="lock"
								iconPosition="left"
								placeholder="Password"
							/>
							{!!formErrors.password && <Label pointing>{formErrors.password}</Label>}
						</Form.Field>
						<Button>Sign-in</Button>
					</Form>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
}
