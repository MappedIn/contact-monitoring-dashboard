import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { Input, AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import api from 'http/apiInstance';
import { useParams } from 'react-router-dom';

import './TopbarSearch.scss';

const TopbarSearch = ({ deviceSwitchHandler }) => {
	const [search, setSearch] = useState('');
	const [results, setResults] = useState([]);
	const { venue } = useParams();

	const handleSearch = _.debounce((e) => setSearch(e), 250);
	useEffect(() => {
		(async () => {
			if (search && search.length > 1) {
				try {
					const results = await api
						.get(`/api/device/venue/${venue}/search`, { search })
						.exec();
					console.log(results);
					setResults(
						results.map((device) => ({
							value: device._id,
							label: (
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}>
									<span>{device._id + ''}</span>
									<span>{device.type}</span>
								</div>
							),
						})),
					);
				} catch (e) {
					console.error(e);
				}
			}
		})();
	}, [venue, search]);

	return (
		<div className="topbar-search">
			<AutoComplete
				dropdownMatchSelectWidth={252}
				style={{ width: 300 }}
				options={results}
				onSelect={deviceSwitchHandler}
				onSearch={handleSearch}>
				<Input prefix={<SearchOutlined />} placeholder="Search" />
			</AutoComplete>
		</div>
	);
};

export default TopbarSearch;
