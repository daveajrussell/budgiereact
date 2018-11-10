import React, { Component } from 'react';
import Router from "./Router";

export default class Content extends Component {
	render() {
		return (
			<section className="section">
				<div className="container">
					<div className="columns">
						<div className="column">
							<div className="content">
								<Router />
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}
}