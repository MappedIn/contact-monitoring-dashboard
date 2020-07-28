import React, { useEffect, useRef } from 'react';
import MapboxGL from 'mapbox-gl';
import _ from 'lodash';

import 'mapbox-gl/dist/mapbox-gl.css';

import './Map.scss';

const DESIRED_LAYERS = ['space', 'level', 'obstruction'];

const setMapBounds = (map, files, levels, currentLevelId) => {
	const featureCoordinates = [];
	DESIRED_LAYERS.forEach((layerName) => {
		files[`${layerName}/${currentLevelId}.geojson`].features.forEach(
			({ geometry }) => {
				featureCoordinates.push(geometry.coordinates);
			},
		);
	});

	const bounds = _.reduce(
		_.flatten(_.flatten(featureCoordinates)),
		(bounds, coord) => {
			return bounds.extend(coord);
		},
		new MapboxGL.LngLatBounds(),
	);

	const longAxisDiff = Math.max(
		bounds.getEast() - bounds.getWest(),
		bounds.getNorth() - bounds.getSouth(),
	);
	const paddedBounds = [
		bounds.getWest() - longAxisDiff,
		bounds.getSouth() - longAxisDiff,
		bounds.getEast() + longAxisDiff,
		bounds.getNorth() + longAxisDiff,
	];

	map.setMaxBounds(paddedBounds);
	map.fitBounds(bounds, {
		padding: 20,
		animate: false,
	});
};

const addBasemapLayers = (map, files, levels, currentLevelId) => {
	DESIRED_LAYERS.forEach((layerName) => {
		map.addSource(`${layerName}/${currentLevelId}`, {
			type: 'geojson',
			data: files[`${layerName}/${currentLevelId}.geojson`],
			generateId: true,
		});
	});

	map.addLayer({
		id: 'floor',
		type: 'fill',
		source: `level/${currentLevelId}`,
		paint: {
			'fill-color': '#AAAAAA',
			'fill-opacity': 1,
		},
	});

	map.addLayer({
		id: 'obstruction',
		type: 'fill',
		source: `obstruction/${currentLevelId}`,
		paint: {
			'fill-color': ['get', 'color'],
			'fill-opacity': 1,
		},
	});

	map.addLayer({
		id: `units`,
		type: 'fill',
		source: `space/${currentLevelId}`,
		paint: {
			'fill-color': ['get', 'color'],
			'fill-opacity': 1,
		},
	});
};

const addContactPoints = (map, data, thisDeviceId, levels, currentLevel) => {
	const elevation = levels[currentLevel].elevation;
	const dataOnCurrentLevel = data.filter((d) => {
		return d.firstcontact.floor === elevation;
	});

	const contactPointGeoJSON = {
		type: 'FeatureCollection',
		features: dataOnCurrentLevel.map((d) => ({
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [
					(d.firstcontact.events[0].lonlat[0] +
						d.firstcontact.events[1].lonlat[0]) /
						2,
					(d.firstcontact.events[0].lonlat[1] +
						d.firstcontact.events[1].lonlat[1]) /
						2,
				],
			},
			properties: {
				...d,
			},
		})),
	};

	map.addSource('contact_points', {
		type: 'geojson',
		data: contactPointGeoJSON,
		cluster: true,
		clusterMaxZoom: 19,
		clusterRadius: 30,
	});

	map.addLayer({
		id: 'clusters',
		type: 'circle',
		source: 'contact_points',
		filter: ['has', 'point_count'],
		paint: {
			'circle-color': [
				'step',
				['get', 'point_count'],
				'#51bbd6',
				100,
				'#f1f075',
				750,
				'#f28cb1',
			],
			'circle-radius': [
				'step',
				['get', 'point_count'],
				20,
				100,
				30,
				750,
				40,
			],
		},
	});

	map.addLayer({
		id: 'cluster-count',
		type: 'symbol',
		source: 'contact_points',
		filter: ['has', 'point_count'],
		layout: {
			'text-field': '{point_count_abbreviated}',
			'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
			'text-size': 12,
		},
	});

	map.addLayer({
		id: 'unclustered-point',
		type: 'circle',
		source: 'contact_points',
		filter: ['!', ['has', 'point_count']],
		paint: {
			'circle-color': '#11b4da',
			'circle-radius': 4,
			'circle-stroke-width': 1,
			'circle-stroke-color': '#fff',
		},
	});

	const popupContents = (feature) => {
		let contactedJSON = feature.properties.devices;
		if (typeof contactedJSON === 'string') {
			contactedJSON = JSON.parse(contactedJSON);
		}
		const contactedDevice = contactedJSON.find(
			(device) => device !== thisDeviceId,
		);
		const startTime = new Date(
			feature.properties.start * 60000,
		).toLocaleTimeString('en-us', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});
		let distance;
		const mindistance = feature.properties.mindistance.toFixed(1);
		const maxdistance = feature.properties.maxdistance.toFixed(1);

		if (mindistance === maxdistance) {
			distance = mindistance + ' Meters';
		} else {
			distance = `${feature.properties.mindistance.toFixed(1)} -
				${feature.properties.maxdistance.toFixed(1)} Meters`;
		}
		const duration = feature.properties.duration + ' Minutes';

		return `
			<div class='map-contact-block'>
				<div class='map-contact-important'>
					<span class='map-contact-title'>Contact With</span><br />
					<span class='map-contact-other'>${contactedDevice}</span>
				</div>
				<span class='map-contact-row'>${startTime}</span><br />
				<span class='map-contact-row'>Within ${distance}</span><br />
				<span class='map-contact-row'>For ${duration}</span>
			</div>`;
	};

	map.on('click', 'unclustered-point', (e) => {
		const coordinates = e.features[0].geometry.coordinates.slice();

		new MapboxGL.Popup()
			.setLngLat(coordinates)
			.setHTML(`<div>${popupContents(e.features[0])}</div>`)
			.addTo(map);
	});

	map.on('click', 'clusters', (e) => {
		const coordinates = e.features[0].geometry.coordinates.slice();

		const clusterId = e.features[0].properties.cluster_id;

		map.getSource('contact_points').getClusterChildren(
			clusterId,
			(_, children) => {
				const childHtml = children.map(popupContents).join('');
				const boxHtml = `<div style="height:180px;overflow-y:scroll">${childHtml}</div>`;
				new MapboxGL.Popup()
					.setLngLat(coordinates)
					.setHTML(boxHtml)
					.addTo(map);
			},
		);
	});
};

const Map = (props) => {
	const mapElementRef = useRef();
	const mapboxObjectRef = useRef();

	useEffect(() => {
		if (!props.MVFFiles || !props.levels || !props.currentLevel) {
			return;
		}

		mapboxObjectRef.current = new MapboxGL.Map({
			container: mapElementRef.current,
			style: '/__dist__/mapbox-style/blank.json',
		});

		const map = mapboxObjectRef.current;
		map.on('load', async function() {
			setMapBounds(map, props.MVFFiles, props.levels, props.currentLevel);
			addBasemapLayers(
				map,
				props.MVFFiles,
				props.levels,
				props.currentLevel,
			);
			addContactPoints(
				map,
				props.contactEvents.data,
				props.deviceId,
				props.levels,
				props.currentLevel,
			);
		});

		map.on('error', function(err) {
			console.log(err);
		});

		return () => {
			if (mapboxObjectRef.current) {
				mapboxObjectRef.current.remove();
			}
		};
	}, [props.contactEvents, props.MVFFiles, props.levels, props.currentLevel]);

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
			}}
			ref={mapElementRef}
		/>
	);
};

export default Map;
