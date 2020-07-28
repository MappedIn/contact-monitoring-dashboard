import React, { useEffect, useState } from 'react';
import moment from 'moment';
import api from 'http/apiInstance';
import { Layout } from 'antd';
const { Content } = Layout;
import Sidebar from 'views/Sidebar';
import DashboardView from 'views/DashboardView';
import Topbar from './Topbar';
import { generatePath, useHistory } from 'react-router-dom';

import './RootView.scss';

const RootView = ({ urlParams }) => {
	const [dateRange, setDateRange] = useState({
		start: moment()
			.subtract(5, 'd')
			.valueOf(),
		end: moment().valueOf(),
	});
	const [data, setData] = useState({
		deviceId: undefined,
		data: [],
	});

	const history = useHistory();
	const setDeviceId = (deviceId) => {
		history.push(
			generatePath('/venue/:venue/deviceid/:deviceid', {
				venue: urlParams.venue,
				deviceid: deviceId,
			}),
		);
	};

	const onDateChange = (dates) => {
		setDateRange({
			start: moment(dates[0]._d).valueOf(),
			end: moment(dates[1]._d).valueOf(),
		});
	};

	useEffect(() => {
		if (urlParams.deviceid) {
			(async () => {
				const deviceIdForRequest = urlParams.deviceid;
				const data = await api
					.get(`/api/contact-events/device/${urlParams.deviceid}`, {
						start: dateRange.start,
						end: dateRange.end,
					})
					.exec();
				console.log(data);
				setData({
					deviceId: deviceIdForRequest,
					data,
				});
			})();
		}
	}, [dateRange.start, dateRange.end, urlParams.deviceid]);

	return (
		<Layout className="root-container">
			<Sidebar />
			<Layout>
				<Topbar
					onDateChange={onDateChange}
					onDeviceIdChange={setDeviceId}
				/>
				<Content className="content">
					<DashboardView
						contactEvents={data}
						deviceId={urlParams.deviceid}
					/>
				</Content>
			</Layout>
		</Layout>
	);
};

export default RootView;
