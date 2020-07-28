import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

import './TopbarDatePicker.scss';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const TopbarDatePicker = ({ onDateChange }) => {
	return (
		<div className="topbar-date-picker">
			<span>Showing data for:</span>
			<RangePicker
				defaultValue={[
					moment(moment().subtract(5, 'd'), dateFormat),
					moment(moment(), dateFormat),
				]}
				format={dateFormat}
				ranges={{
					Today: [moment(), moment()],
					'Last 5 Days': [moment().subtract(5, 'd'), moment()],
				}}
				onChange={onDateChange}
			/>
		</div>
	);
};

export default TopbarDatePicker;
