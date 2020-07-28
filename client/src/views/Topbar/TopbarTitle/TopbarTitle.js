import React, { PureComponent } from 'react';

import './TopbarTitle.scss';

const url = window.location.hostname || window.location.host || '';

let mode;
if (url.indexOf('qa') !== -1) {
	mode = 'QA';
} else if (url.indexOf('staging') !== -1) {
	mode = 'Staging';
} else if (url.indexOf('localhost') !== -1) {
	mode = 'Development';
}

class TopbarTitle extends PureComponent {
	static get defaultProps() {
		return {
			mode,
		};
	}

	render() {
		const { title, titleColor, mode } = this.props;

		const color = mode ? '#ffffff' : titleColor;

		return (
			<a
				href="/"
				className="topbar-title"
				style={{
					color: color,
					fill: color,
				}}>
				<span className="topbar-title-logo-text-container">
					<span className="topbar-title-logo-container">
						<svg
							className="topbar-title-logo"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 116.8 185">
							<path d="M109.1,56.6H89.3c-5,0-7.4,2.2-7.4,7v60.3l-40.3-62c-2.8-4.3-4.6-5.1-10.2-5.3H11.9c-5.2,0-7.6,2.2-7.6,7V178.1c0,4.8,2.4,7,7.6,7H31.7c5.2,0,7.6-2.2,7.6-7v-60l40.5,61.7c3,4.5,4.6,5.3,10.2,5.3h19.2c5.2,0,7.6-2.2,7.6-7V63.6C116.6,58.8,114.2,56.6,109.1,56.6Z" />
							<circle cx="21.8" cy="21.8" r="21.8" />
						</svg>
					</span>

					<span className="topbar-title-text">{title}</span>
				</span>
				{mode && <span className="topbar-title-mode">{mode}</span>}
			</a>
		);
	}
}

export default TopbarTitle;
