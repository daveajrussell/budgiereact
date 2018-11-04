import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from './../store/budgets/actions';
import moment from 'moment';
import { history } from './../store/history';

class Budgets extends Component {
    constructor(props) {
        super(props);
        const { year, month } = this.props.match.params;

        if (year && month) {
            const currentYear = parseInt(year),
                currentMonth = parseInt(month) - 1,
                date = new Date(currentYear, currentMonth);

            this.state = {
                currentDate: moment(date)
            }
        } else {
            this.state = {
                currentDate: moment()
            };
        }
    }

    componentDidMount() {
        const { month, year } = this.props.match.params;
        this.setCurrentBudgetDate(month, year);
        this.getBudget(month, year);
    }

    componentDidUpdate() {
        const { month, year } = this.props.match.params;
        this.setCurrentBudgetDate(month, year);
        this.getBudget(month, year);
    }

    getBudget(month, year) {
        if (month && year) {
            const { budget, loading } = this.props;
            const { currentDate } = this.state;

            if (!loading) {
                if (!budget && currentDate.year() && currentDate.month()) {
                    this.props.getBudget(currentDate.year(), currentDate.month() + 1);
                } else if (budget && budget.month !== currentDate.month() + 1) {
                    this.props.getBudget(currentDate.year(), currentDate.month() + 1);
                }
            }
        }
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
        history.push(`/budgets/${currentDate.month() + 1}/${currentDate.year()}`);
    }

    renderBudget(budget) {
        if (budget) {
            return (
                <ul>
                    <li>Total budgeted: {budget.totalBudgeted}</li>
                    <li>Total saved: {budget.totalSaved}</li>
                    <li>Income vs. expendtiture: {budget.incomeVsExpenditure}</li>
                </ul>
            )
        }
    }

    render() {
        const { loading, budget } = this.props;
        const { currentDate } = this.state;
        return (
            <main>
                <section className="section">
                    <div className="container">
                        <div className="columns">
                            <div className="column is-8-desktop is-offset-2-desktop">
                                <div className="content">
                                    <h3>Budget - {`${currentDate.format('MMMM')}/${currentDate.year()}`}</h3>
                                    {
                                        loading ?
                                            <main>
                                                <div>Loading...</div>
                                            </main>
                                            :
                                            <main>
                                                {this.renderBudget(budget)}
                                            </main>
                                    }
                                    <button onClick={() => this.goBack()} className="button is-pulled-left">Go back</button>
                                    <button onClick={() => this.goForward()} className="button is-pulled-right">Go forward</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main >
        );
    }
}

export default connect(
    state => state.budgets,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Budgets);