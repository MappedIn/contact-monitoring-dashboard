import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Input, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './ContactTable.scss';

const tableColumns = [
	{
		title: (
			<span className="table-column-header first-table-column">
				In Contact With
			</span>
		),
		dataIndex: 'inContactWith',
		align: 'left',
		// eslint-disable-next-line react/display-name
		render: (inContactWith) => (
			<div className="first-table-column">
				<span className="device-id">{inContactWith.deviceId}</span>
			</div>
		),
	},
	{
		title: <span className="table-column-header">Times Contacted</span>,
		dataIndex: 'timesContacted',
		align: 'right',
		width: '115px',
		// eslint-disable-next-line react/display-name
		render: (timesContacted) => (
			<span className="table-values">{timesContacted}</span>
		),
		defaultSortOrder: 'descend',
		sorter: (a, b) => a.timesContacted - b.timesContacted,
	},
	{
		title: <span className="table-column-header">Average Duration</span>,
		dataIndex: 'averageDuration',
		align: 'right',
		width: '115px',
		// eslint-disable-next-line react/display-name
		render: (averageDuration) => (
			<div className="table-cell">
				<span className="table-values">{averageDuration}</span>
				<br />
				<span className="table-units">Minutes</span>
			</div>
		),
		sorter: (a, b) => a.averageDuration - b.averageDuration,
	},
	{
		title: <span className="table-column-header">Longest Duration</span>,
		dataIndex: 'longestDuration',
		align: 'right',
		width: '115px',
		// eslint-disable-next-line react/display-name
		render: (longestDuration) => (
			<>
				<span className="table-values">{longestDuration}</span>
				<br />
				<span className="table-units">Minutes</span>
			</>
		),
		sorter: (a, b) => a.longestDuration - b.longestDuration,
	},
	{
		title: (
			<span className="table-column-header last-table-column">
				First Contact
			</span>
		),
		dataIndex: 'firstContact',
		align: 'right',
		width: '120px',
		// eslint-disable-next-line react/display-name
		render: (firstContact) => (
			<span className="last-table-column">
				{firstContact.formattedTime}
			</span>
		),
		sorter: (a, b) => a.firstContact.minutes - b.firstContact.minutes,
	},
];

const getAverageDuration = (contactEvents) => {
	return _.meanBy(contactEvents, (event) => {
		return event.duration;
	});
};

const getLongestDuration = (contactEvents) => {
	return _.maxBy(contactEvents, (event) => {
		return event.duration;
	}).duration;
};

const getEarliestEvent = (contactEvents) => {
	return _.minBy(contactEvents, (event) => {
		return event.start;
	}).start;
};

const calculateContactEventsData = (
	currentDeviceId,
	contactedDeviceId,
	contactEvents,
) => {
	return {
		key: contactedDeviceId,
		inContactWith: {
			deviceId: contactedDeviceId.toUpperCase(),
		},
		timesContacted: contactEvents.length,
		averageDuration: _.round(getAverageDuration(contactEvents), 2),
		longestDuration: getLongestDuration(contactEvents),
		firstContact: {
			minutes: getEarliestEvent(contactEvents),
			formattedTime: moment(
				getEarliestEvent(contactEvents) * 60000,
			).format('MMM D, h:mma'),
		},
	};
};

const ContactTable = ({ contactEvents, deviceId }) => {
	let isLoading = false;
	let tableData = [];
	if (deviceId) {
		if (deviceId !== contactEvents.deviceId) {
			isLoading = true;
		} else {
			const contactData = _.groupBy(
				contactEvents.data,
				(contactEvent) => {
					return contactEvent.devices[0] === deviceId
						? contactEvent.devices[1]
						: contactEvent.devices[0];
				},
			);

			tableData = _.map(contactData, (contactedDeviceEvents, index) => {
				return calculateContactEventsData(
					deviceId,
					index,
					contactedDeviceEvents,
				);
			});
		}
	}

	return (
		<>
			<div className="contact-search">
				<Input
					placeholder="Search"
					prefix={<SearchOutlined />}
					className="search-input"
				/>
			</div>
			<div className="contact-table">
				<Table
					columns={tableColumns}
					dataSource={tableData}
					pagination={{ pageSize: 5 }}
					size="small"
					rowClassName="table-row"
					loading={isLoading}
				/>
			</div>
		</>
	);
};

export default ContactTable;
