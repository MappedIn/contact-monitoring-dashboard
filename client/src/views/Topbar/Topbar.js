import React from 'react';
import auth from 'http/authInstance';
import TopbarSearch from './TopbarSearch';
import TopbarUserMenu from './TopbarUserMenu';
import TopbarDatePicker from './TopbarDatePicker';
import { MenuFoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';

import './Topbar.scss';

const { Header } = Layout;

function onLogoutClick(e) {
	auth.logout();

	e.preventDefault();
}

const Topbar = ({ onDateChange, onDeviceIdChange }) => {
	return (
		<Header className="topbar">
			<MenuFoldOutlined className="sidebar-toggle" />
			<TopbarSearch deviceSwitchHandler={onDeviceIdChange} />
			<TopbarDatePicker onDateChange={onDateChange} />
			<TopbarUserMenu name={'User'} onLogoutClick={onLogoutClick} />
		</Header>
	);
};

export default Topbar;
