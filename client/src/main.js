import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter,
	Route,
	Redirect,
	generatePath,
	Switch,
} from 'react-router-dom';
import config from 'config';
import _ from 'lodash';

import RootView from './views/RootView';

import './main.scss';

const venues = _.reduce(
	config.mappedinVenueSlugs,
	(result, value) => {
		result[value] = true;
		return result;
	},
	{},
);

const defaultVenue = config.mappedinVenueSlugs[0];

const TheRouteComponent = ({ match }) => {
	if (!venues[match.params.venue]) {
		return (
			<Redirect
				to={generatePath('/venue/:venue/', {
					venue: defaultVenue,
				})}
			/>
		);
	}
	return <RootView urlParams={match.params} />;
};

const App = () => (
	<BrowserRouter>
		<Switch>
			<Route
				path="/venue/:venue/deviceid/:deviceid"
				render={TheRouteComponent}
			/>
			<Route path="/venue/:venue" render={TheRouteComponent} />
			<Route path="/*">
				<Redirect to={`/venue/${defaultVenue}/`} />
			</Route>
		</Switch>
	</BrowserRouter>
);

function run() {
	ReactDOM.render(<App />, document.getElementById('app'));
}

export default async function start() {
	run();
}
