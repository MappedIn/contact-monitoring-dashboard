import React, { useState } from 'react';
import ContactTable from './ContactTable';
import ContactMap from './ContactMap';
import { Card, Menu } from 'antd';
import './ContactDataCard.scss';
import _ from 'lodash';

const dataDisplayTypes = {
	CONTACT_TABLE: 'CONTACT_TABLE',
	CONTACT_MAP: 'CONTACT_MAP',
};

const getNumberOfContactedDevices = (data, deviceId) => {
	const contactData = _.groupBy(data, (contactEvent) => {
		return contactEvent.devices[0] === deviceId
			? contactEvent.devices[1]
			: contactEvent.devices[0];
	});
	return Object.keys(contactData).length;
};

const ContactDataCard = ({ contactEvents, deviceId }) => {
	const [dataView, setDataView] = useState(dataDisplayTypes.CONTACT_TABLE);
	const onSelect = (menuSelection) => {
		setDataView(menuSelection.key);
	};

	const inContactWith =
		contactEvents.deviceId === deviceId
			? `(${getNumberOfContactedDevices(contactEvents.data, deviceId)})`
			: '';

	return (
		<Card className="contact-data-card" bordered={false}>
			<Menu
				defaultSelectedKeys={[dataDisplayTypes.CONTACT_TABLE]}
				mode="horizontal"
				onSelect={onSelect}
				className="contact-menu">
				<Menu.Item key={dataDisplayTypes.CONTACT_TABLE}>
					In Contact With {inContactWith}
				</Menu.Item>
				<Menu.Item key={dataDisplayTypes.CONTACT_MAP}>
					Contact Events Map
				</Menu.Item>
			</Menu>

			{dataView === dataDisplayTypes.CONTACT_TABLE && (
				<ContactTable
					contactEvents={contactEvents}
					deviceId={deviceId}
				/>
			)}

			{dataView === dataDisplayTypes.CONTACT_MAP && (
				<ContactMap contactEvents={contactEvents} deviceId={deviceId} />
			)}
		</Card>
	);
};

export default ContactDataCard;
