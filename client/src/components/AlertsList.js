import React from 'react';
import { connect } from 'react-redux';
import { Button, Responsive, Table, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { removeAlert, fetchAlerts } from '../actions/alerts';

const AlertsList = (props) => {
	const alertTable = (alertType) => {
		const priceChangeStyle = { color: alertType === 'BUY' ? '#e15241' : '#43aa05' };
		// filter by alertType
		const filteredAlertsList = props.alertsList
			.filter((a) => a.alertType === alertType)
			.map((a) => {
				a.change = +parseFloat((a.price / a.currentPrice - 1) * 100).toFixed(2);
				return a;
			})
			// sort by abs(change) ASC
			.sort((a, b) => (a.alertType === 'BUY' ? -a.change + b.change : a.change - b.change));

		if (filteredAlertsList.length === 0) {
			return null;
		}

		return (
			<React.Fragment>
				<Header textAlign="center" as="h2">
					{alertType === 'BUY' ? 'Buy' : 'Sell'} Alerts
				</Header>
				<Table unstackable celled>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Pairing</Table.HeaderCell>
							<Table.HeaderCell>Target Price</Table.HeaderCell>
							<Responsive as={Table.HeaderCell} minWidth={500}>
								Current Price
							</Responsive>
							<Responsive as={Table.HeaderCell} minWidth={700}>
								% Change Needed
							</Responsive>
							<Table.HeaderCell>Remove Alert</Table.HeaderCell>
							<Table.HeaderCell>Trade</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{filteredAlertsList.map((a) => {
							return (
								<Table.Row key={a.id}>
									<Table.Cell>{a.pairing}</Table.Cell>
									<Table.Cell>{a.price}</Table.Cell>
									<Responsive as={Table.Cell} minWidth={500}>
										{a.currentPrice}
									</Responsive>
									<Responsive style={priceChangeStyle} as={Table.Cell} minWidth={700}>
										{a.change + '%'}
									</Responsive>
									<Table.Cell>
										<span onClick={() => removeAlert(a.id)} className="big-link">
											<Icon name="remove" />
										</span>
									</Table.Cell>
									<Table.Cell>
										<a
											className="big-link"
											target="_blank"
											rel="noopener noreferrer"
											href={'https://www.binance.com/trade.html?symbol=' + a.pairing}
										>
											<Icon name="linkify" />
										</a>
									</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
			</React.Fragment>
		);
	};

	return (
		<div>
			<div style={{ display: 'flex' }}>
				<Button as={Link} to="/addalert" icon labelPosition="left">
					<Icon name="plus" />
					Add Alert
				</Button>
				<Button onClick={fetchAlerts} icon style={{ marginLeft: 'auto' }}>
					<Icon name="refresh" />
				</Button>
			</div>
			{alertTable('BUY')}
			{alertTable('SELL')}
		</div>
	);
};

const mapStateToProps = (state) => ({
	alertsList: state.alertsList
});

export default connect(mapStateToProps)(AlertsList);
