import React from 'react';
import { Avatar, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import './TopbarUserMenu.scss';

const purple = '#722ED1';

// TODO get name from auth0 profile, to display in the avatar component
const TopbarUserMenu = (props) => {
	const { name, onLogoutClick } = props;

	return (
		<Dropdown
			placement="bottomRight"
			trigger={['click']}
			overlay={
				<Menu>
					<Menu.Item key="0">
						<a href={'#'} onClick={onLogoutClick}>
							Logout
						</a>
					</Menu.Item>
				</Menu>
			}>
			<div className="topbar-user-menu">
				<Avatar
					style={{
						backgroundColor: purple,
						verticalAlign: 'middle',
					}}
					size="small">
					{name}
				</Avatar>
				<DownOutlined />
			</div>
		</Dropdown>
	);
};

export default TopbarUserMenu;
