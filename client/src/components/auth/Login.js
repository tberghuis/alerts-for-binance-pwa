import React, { useState } from 'react';
import { Header, Label, Input, Grid, Form, Button } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';

export default function Login({ login, history }) {
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

		// TODO move this to action
		try {
			await login(userData);
		} catch (resErr) {
			console.log('resErr', resErr);
			// server validation failed, email already exists
			if (resErr.response) {
				console.log('resErr.response', resErr.response);
				setFormErrors(resErr.response.data);
			}
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
