import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'

export class CollapsibleTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: true
        }
    }

    toggleTable(isCollapsed) {
        this.setState({ isCollapsed: !isCollapsed })
    }

    render() {
        const tableClassName = "table is-striped";
        const { isCollapsed } = this.state;
        const { title, children } = this.props;
        return (
            <main>
                <a onClick={() => this.toggleTable(isCollapsed)} className="has-text-black">
                    <h4 className={isCollapsed ? "is-marginless" : ""}>
                        {title}
                        <FontAwesomeIcon icon={isCollapsed ? faAngleUp : faAngleDown} pull="right" />
                    </h4>
                </a>
                <table className={isCollapsed ? `${tableClassName} is-hidden` : tableClassName}>
                    {children}
                </table>
            </main >
        );
    }
}