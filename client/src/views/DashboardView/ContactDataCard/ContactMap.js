import React, { useEffect, useState } from 'react';
import Map from 'views/Map';
import './ContactMap.scss';
import JSZip from 'jszip';
import _ from 'lodash';
import api from 'http/apiInstance';
import { Select } from 'antd';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const LEVEL = 'level';

const fetchMFVFiles = async (venueSlug) => {
	try {
		const deviceResults = await api
			.get(`/api/mvf-bundle/venue-slug/${venueSlug}`)
			.exec();

		const res = await fetch(deviceResults.url);
		const ab = await res.blob();
		const file = new File([ab], 'mvf.zip');
		const zip = await JSZip.loadAsync(file);

		const promises = [];

		const files = {};
		zip.forEach((relativePath, zipEntry) => {
			promises.push(
				zipEntry.async('text').then((content) => {
					files[relativePath] = JSON.parse(content);
				}),
			);
		});

		await Promise.all(promises);
		return files;
	} catch (e) {
		console.error(e);
		return Promise.reject(e);
	}
};

const getLevels = (files) => {
	const subfiles =
		files['manifest.geojson'].features[0].properties.folder_struct;
	const level = _.find(subfiles, ({ name }) => name === LEVEL);

	return _.reduce(
		level.children,
		(result, value) => {
			const l = files[`${LEVEL}/${value.name}`];
			const levelProperties = l.features[0].properties;

			return {
				...result,
				[levelProperties.id]: levelProperties,
			};
		},
		{},
	);
};

const ContactMap = ({ contactEvents, deviceId }) => {
	const [MVFFiles, setMVFFiles] = useState();
	const [levels, setLevels] = useState({
		levels: {},
		levelOptions: {},
		currentLevel: undefined,
	});

	const venueSlug = useParams().venue;

	useEffect(() => {
		(async () => {
			const files = await fetchMFVFiles(venueSlug);
			const newLevels = getLevels(files);
			const levelOptions = _.reverse(
				_.sortBy(
					_.map(newLevels, (level) => level),
					['elevation'],
				),
			);

			const defaultLevel = _(levelOptions)
				.filter(({ elevation }) => elevation >= 0)
				.last() ||
				_(levelOptions)
					.filter(({ elevation }) => elevation < 0)
					.first() || { id: undefined };

			setMVFFiles(files);
			setLevels({
				levels: newLevels,
				levelOptions: levelOptions,
				currentLevel: defaultLevel.id,
			});
		})();
	}, [venueSlug]);

	const handleLevelChange = (value) => {
		setLevels({
			levels: levels.levels,
			levelOptions: levels.levelOptions,
			currentLevel: value,
		});
	};

	return (
		<div className="contact-map">
			<Map
				contactEvents={contactEvents}
				deviceId={deviceId}
				MVFFiles={MVFFiles}
				levels={levels.levels}
				currentLevel={levels.currentLevel}
			/>
			<Select
				className="level-selector"
				value={levels.currentLevel}
				onChange={handleLevelChange}>
				{_.map(levels.levelOptions, (level) => {
					return (
						<Option value={level.id} key={level.id}>
							{level.name}
						</Option>
					);
				})}
			</Select>
		</div>
	);
};

export default ContactMap;
