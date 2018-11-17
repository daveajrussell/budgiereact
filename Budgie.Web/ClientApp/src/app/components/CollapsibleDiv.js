import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'

export class CollapsibleDiv extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: false
        }
    }

    toggleTable(isCollapsed) {
        this.setState({ isCollapsed: !isCollapsed })
    }

    render() {
        const { isCollapsed } = this.state;
        const { title, children } = this.props;
        return (
            <main>
                <span onClick={() => this.toggleTable(isCollapsed)} className="has-text-black">
                    <h4 className={isCollapsed ? "is-marginless" : ""}>
                        {title}
                        <FontAwesomeIcon icon={isCollapsed ? faAngleUp : faAngleDown} pull="right" />
                    </h4>
                </span>
                <div className={isCollapsed ? 'is-hidden' : ''}>
                    {children}
                </div>
            </main >
        );
    }
}