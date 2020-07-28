import React from 'react';

import { Layout, Menu } from 'antd';
const { Sider } = Layout;
import { DashboardOutlined } from '@ant-design/icons';

import MappedinTextLogo from 'static/images/mappedin_horizontal_logo_orange.svg';

import './Sidebar.scss';

const Sidebar = () => {
	return (
		<Sider trigger={null}>
			<div className="sidebar-logo">
				<img src={MappedinTextLogo} alt="Mappedin" />
			</div>
			<Menu theme="dark" mode="inline" selectedKeys={['1']}>
				<Menu.Item key="1" icon={<DashboardOutlined />}>
					Dashboard
				</Menu.Item>
			</Menu>
		</Sider>
	);
};

export default Sidebar;
