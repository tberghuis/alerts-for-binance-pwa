import React from 'react';
import { Dropdown, Header, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

const Navbar = ({ location, logout, authState }) => (
	<div>
		<Menu borderless attached="top">
			<div className="menu-left">
				<Dropdown className="burger-menu" item icon="sidebar" simple>
					<Dropdown.Menu>
						{authState === 'LOGGED_OUT' ? (
							[
								<Dropdown.Item key="login" as={Link} to="/login">
									Sign-in
								</Dropdown.Item>,
								<Dropdown.Item key="register" as={Link} to="/register">
									Sign-up
								</Dropdown.Item>
							]
						) : (
							<Dropdown.Item onClick={logout}>Log out</Dropdown.Item>
						)}
					</Dropdown.Menu>
				</Dropdown>
			</div>

			<Menu.Item className="navbar-header">
				{/* TODO add favicon */}
				{location.pathname !== '/' && (
					<Header as={Link} to="/">
						Alerts for Binance
					</Header>
				)}
			</Menu.Item>
			{/* this makes .navbar-header centered, could have used :after on menu container */}
			<div className="menu-right" />
		</Menu>
	</div>
);

export default withRouter(Navbar);
