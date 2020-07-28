import React from 'react';
import renderer from 'react-test-renderer';

import TopbarTitle from './TopbarTitle';

test('TopbarTitle renders defaults', () => {
	const component = renderer.create(<TopbarTitle />);
	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test('TopbarTitle renders title, titleColor, and mode', () => {
	const component = renderer.create(
		<TopbarTitle title="Title" titleColor="red" mode="test" />,
	);
	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});
