import React, { useState } from 'react';
import { Header, Label, Input, Grid, Form, Button } from 'semantic-ui-react';
import Isemail from 'isemail';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import axios from 'axios';

export default function Register({ history }) {
	const [ formErrors, setFormErrors ] = useState({});

	// what would useState with no initial arg do?
	const [ emailRef, setEmailRef ] = useState(null);
	const [ passwordRef, setPasswordRef ] = useState(null);
	const [ passwordConfirmRef, setPasswordConfirmRef ] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const email = trim(emailRef.inputRef.current.value);
		const password = passwordRef.inputRef.current.value;
		const password2 = passwordConfirmRef.inputRef.current.value;

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
			setFormErrors(formErrors);
			return;
		}

		const userData = { email, password, password2 };

		try {
			await axios.post('/api/users/register', userData);
			history.push('/login');
		} catch (resErr) {
			console.log('resErr', resErr.response);
			// server validation failed, email already exists
			formErrors = resErr.response.data;
			this.setState({ formErrors });
		}
	};

	return (
		<Grid centered>
			<Grid.Row>
				<Grid.Column mobile={16} tablet={8}>
					<Header textAlign="center" as="h1">
						Sign up
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
						<Form.Field error={!!formErrors.password2}>
							<label>Confirm Password</label>
							<Input
								ref={(input) => setPasswordConfirmRef(input)}
								type="password"
								icon="lock"
								iconPosition="left"
								placeholder="Password"
							/>
							{!!formErrors.password2 && <Label pointing>{formErrors.password2}</Label>}
						</Form.Field>
						<Button>Sign-up</Button>
					</Form>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
}
