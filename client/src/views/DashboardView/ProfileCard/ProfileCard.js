import React, { useEffect, useState, useRef } from 'react';
import { Card, Divider } from 'antd';
import api from 'http/apiInstance';
import {
	MobileOutlined,
	AlertOutlined,
	UsergroupAddOutlined,
	ClockCircleOutlined,
	ClockCircleFilled,
} from '@ant-design/icons';
import deviceImage from '../../../static/images/device.png';
import _ from 'lodash';
import './ProfileCard.scss';

const getProfileCardData = (data, deviceId) => {
	if (data.length) {
		const contactData = _.groupBy(data, (contactEvent) => {
			return contactEvent.devices[0] === deviceId
				? contactEvent.devices[1]
				: contactEvent.devices[0];
		});
		const totalContactEvents = data.length;
		const inContactWith = Object.keys(contactData).length;
		const averageDuration = _.meanBy(data, (event) => {
			return event.duration;
		});
		const longestDuration = _.maxBy(data, (event) => {
			return event.duration;
		}).duration;
		return {
			totalContactEvents,
			inContactWith,
			averageDuration: _.round(averageDuration, 2),
			longestDuration,
		};
	}
	return {};
};

const ProfileCard = ({ deviceId, contactEvents }) => {
	const [deviceData, setDeviceData] = useState([]);
	const isDeviceDataLoading = useRef(false);

	let isContactEventsLoading = false;
	if (deviceId) {
		if (deviceId !== contactEvents.deviceId) {
			isContactEventsLoading = true;
		}
	}

	useEffect(() => {
		if (deviceId) {
			isDeviceDataLoading.current = true;
			(async () => {
				const deviceResults = await api
					.get(`/api/device/id/${deviceId}`)
					.exec();
				isDeviceDataLoading.current = false;
				setDeviceData(deviceResults);
			})();
		}
	}, [deviceId]);

	let allPendingDataLoaded = false;
	if (deviceId) {
		if (!isContactEventsLoading && !isDeviceDataLoading.current) {
			allPendingDataLoaded = true;
		}
	}

	let eventsData = {};
	if (allPendingDataLoaded) {
		eventsData = getProfileCardData(contactEvents.data, deviceId);
	}

	return (
		<Card className="profile-card" bordered={false}>
			<div className="centered">
				<img
					className={
						deviceId && allPendingDataLoaded ? '' : 'transparency'
					}
					src={deviceImage}
					alt="Device image"
				/>
				<span>Device ID:</span>
				<span className={`${deviceId ? 'bold' : 'placeholder'}`}>
					{(deviceId && deviceId.toUpperCase()) ||
						'Select a device using the search bar'}
				</span>
			</div>
			<div>
				<ul>
					<li>
						<MobileOutlined />
						{allPendingDataLoaded && deviceData.type ? (
							deviceData.type
						) : (
							<span className="grey-italics">Device Type</span>
						)}
					</li>
				</ul>
			</div>
			<Divider />
			<div className="event-summary">
				<span className="bold title">Contact Event Summary</span>
				<ul>
					<li>
						<AlertOutlined />
						Total Contact Events
						<span className="bold right">
							{eventsData.totalContactEvents}
						</span>
					</li>
					<li>
						<UsergroupAddOutlined />
						In Contact With
						{eventsData.inContactWith && (
							<span className="bold right">
								{eventsData.inContactWith} Devices
							</span>
						)}
					</li>
					<li>
						<ClockCircleOutlined />
						Average Duration
						{eventsData.averageDuration && (
							<span className="bold right">
								{eventsData.averageDuration} Mins
							</span>
						)}
					</li>
					<li>
						<ClockCircleFilled />
						Longest Duration
						{eventsData.longestDuration && (
							<span className="bold right">
								{eventsData.longestDuration} Mins
							</span>
						)}
					</li>
				</ul>
			</div>
		</Card>
	);
};

export default ProfileCard;
