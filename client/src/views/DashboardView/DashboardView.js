import React from 'react';

import ProfileCard from 'views/DashboardView/ProfileCard';
import ContactDataCard from 'views/DashboardView/ContactDataCard';

import './DashboardView.scss';

const DashboardView = ({ contactEvents, deviceId }) => {
	console.log('data', contactEvents);
	console.log('the new device ID', deviceId);
	return (
		<div className="dashboard-view-cards">
			<ProfileCard contactEvents={contactEvents} deviceId={deviceId} />
			<ContactDataCard
				contactEvents={contactEvents}
				deviceId={deviceId}
			/>
		</div>
	);
};

export default DashboardView;
