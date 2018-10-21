import React, { Component } from "react";
import moment from 'moment';
import { history } from './../store/history';

class Budgets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment()
        };
    }

    componentDidMount() {
        const { month, year } = this.props.match.params;
        this.setCurrentBudgetDate(month, year);
    }

    componentDidUpdate() {
        const { month, year } = this.props.match.params;
        this.setCurrentBudgetDate(month, year);
    }

    setCurrentBudgetDate(month, year) {
        if (!month && !year) {
            const currentDate = moment();
            this.setState({ currentDate: currentDate });
            this.goToBudget(currentDate);
        }
    }

    goBack() {
        this.setState({ currentDate: this.state.currentDate.subtract(1, 'month') });
        this.goToBudget(this.state.currentDate);
    }

    goForward() {
        this.setState({ currentDate: this.state.currentDate.add(1, 'month') });
        this.goToBudget(this.state.currentDate);
    }

    goToBudget(currentDate) {
        history.push(`/budgets/${currentDate.format('MMMM').toLowerCase()}/${currentDate.year()}`);
    }

    render() {
        const { currentDate } = this.state;
        return (
            <main>
                <section className="section">
                    <div className="container">
                        <div className="columns">
                            <div className="column is-8-desktop is-offset-2-desktop">
                                <div className="content">
                                    <h3>Budget - {`${currentDate.format('MMMM')}/${currentDate.year()}`}</h3>
                                    <button onClick={() => this.goBack()} className="button is-pulled-left">Go back</button>
                                    <button onClick={() => this.goForward()} className="button is-pulled-right">Go forward</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }
}

export default Budgets;