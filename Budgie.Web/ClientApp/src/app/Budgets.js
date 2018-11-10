import React, { Component } from "react";
import { Modal, CollapsibleTable } from './components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from './../store/budgets/actions';
import moment from 'moment';
import { history } from './../store/history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPoundSign, faCalendar, faListUl } from '@fortawesome/free-solid-svg-icons'
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar';

const modes = {
    edit: 'edit',
    new: 'new'
}

const viewModes = {
    list: 'list',
    calendar: 'calendar'
}

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

        this.setState({
            id: 0,
            submitted: false,
            valid: false,
            show: false,
            mode: modes.new,
            viewMode: viewModes.list
        });
    }

    componentDidUpdate() {
        const { month, year } = this.props.match.params;
        this.setCurrentBudgetDate(month, year);
        this.getBudget(month, year);
    }

    toggleViewMode() {
        const newViewMode = this.state.viewMode === viewModes.list ? viewModes.calendar : viewModes.list;
        this.setState({
            viewMode: newViewMode
        });
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

    showModal = (item) => {
        if (!!item) {
            this.setState({
                submitted: false,
                show: true,
                mode: modes.edit,
                id: item.id,
            });
        } else {
            this.setState({
                submitted: false,
                show: true,
                mode: modes.new
            });
        }
    };

    hideModal = () => {
        this.setState({
            submitted: false,
            show: false,
            id: 0
        });
    };

    handleSave() {
        const { mode, id, category, amount } = this.state;

        if (category, amount) {
            this.setState({
                submitted: true,
                valid: true
            });

            if (mode === modes.new) {
                this.props.addTransaction();
            } else if (mode === modes.edit) {
                this.props.editTransaction();
            }
        } else {
            this.setState({
                submitted: true,
                valid: false
            });
        }
    }

    isModalShown() {
        const { loading } = this.props;
        const { submitted, valid, show } = this.state;

        if (submitted && valid && !loading) return false;

        return show;
    }

    renderBudget(budget) {
        if (budget) {
            return (
                <div class="tile is-ancestor">
                    {this.renderOutgoings()}
                    {this.renderExpenses()}
                </div>
            )
        }
    }

    renderOutgoings() {
        return (
            <div class="tile is-4 is-vertical is-parent">
                <div class="tile is-child box">
                    <CollapsibleTable title="Outgoings - Dedicated">
                        <tbody>
                            <tr>
                                <td>Mortgage</td>
                                <td>£123.00</td>
                            </tr>
                            <tr>
                                <td>Council tax</td>
                                <td>£123.00</td>
                            </tr>
                        </tbody>
                    </CollapsibleTable>
                </div>
                <div class="tile is-child box">
                    <CollapsibleTable title="Outgoings - Budgeted">
                        <tbody>
                            <tr>
                                <td>Mortgage</td>
                                <td>£123.00</td>
                            </tr>
                            <tr>
                                <td>Council tax</td>
                                <td>£123.00</td>
                            </tr>
                        </tbody>
                    </CollapsibleTable>
                </div>
                <div class="tile is-child box">
                    <CollapsibleTable title="Outgoings - Savings">
                        <tbody>
                            <tr>
                                <td>Mortgage</td>
                                <td>£123.00</td>
                            </tr>
                            <tr>
                                <td>Council tax</td>
                                <td>£123.00</td>
                            </tr>
                        </tbody>
                    </CollapsibleTable>
                </div>
                <div class="tile is-child box">
                    <CollapsibleTable title="Outgoings - Totals">
                        <tbody>
                            <tr>
                                <td>Mortgage</td>
                                <td>£123.00</td>
                            </tr>
                            <tr>
                                <td>Council tax</td>
                                <td>£123.00</td>
                            </tr>
                        </tbody>
                    </CollapsibleTable>
                </div>
            </div>
        );
    }

    renderExpenses() {
        const { viewMode } = this.state;
        return (
            <div class="tile is-parent">
                <div class="tile is-child box">
                    <h4>
                        Expenses
                                <div class="buttons is-pulled-right">
                            <a className="button is-small" onClick={() => this.toggleViewMode()}>
                                <span class="icon is-small is-left">
                                    <FontAwesomeIcon icon={viewMode === viewModes.list ? faCalendar : faListUl} />
                                </span>
                            </a>
                        </div>
                    </h4>
                    {this.renderExpenseView()}
                </div>
            </div>
        );
    }

    renderExpenseView() {
        const { viewMode } = this.state;
        if (viewMode === viewModes.list) {
            return this.renderExpenseListView();
        } else {
            return this.renderExpenseCalendarView();
        }
    }

    renderExpenseListView() {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>
                                Date
                                            </th>
                            <th>
                                Category
                                            </th>
                            <th>
                                Amount
                                            </th>
                            <th>
                                Notes
                                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                01/01/0001
                                        </td>
                            <td>
                                Test
                                        </td>
                            <td>
                                £1,000.00
                                        </td>
                            <td>
                                None
                                        </td>
                        </tr>
                    </tbody>
                </table>
                <a className="button is-small is-primary is-pulled-right" onClick={() => this.showModal()}>Add</a>
            </div>
        );
    }

    renderExpenseCalendarView() {
        // const calendars = bulmaCalendar.attach('[type="date"]');
        // calendars.forEach(calendar => {
        //     // Add listener to date:selected event
        //     calendar.on('date:selected', date => {
        //         console.log(date);
        //     });
        // });
        // return (
        //     <input type="date" data-display-mode="inline" data-is-range="true" data-close-on-select="false" />
        // );
    }

    render() {
        const { loading, budget } = this.props;
        const { currentDate, mode, id, category, amount, valid, submitted } = this.state;
        const options = {
            showHeader: false,
            showFooter: false,
            todayButton: false,
            clearButton: false,
            displayMode: 'dialog'
        };
        const calendars = bulmaCalendar.attach('[type="date"]', options);
        calendars.forEach(calendar => {
            // Add listener to date:selected event
            calendar.on('date:selected', date => {
                console.log(date);
            });
        });
        return (
            <main>
                <h3>Budget - {`${currentDate.format('MMMM')}/${currentDate.year()}`}</h3>
                {
                    loading ?
                        <div>Loading...</div>
                        :
                        this.renderBudget(budget)
                }
                <button onClick={() => this.goBack()} className="button is-pulled-left">Go back</button>
                <button onClick={() => this.goForward()} className="button is-pulled-right">Go forward</button>
                <Modal buttonClass={submitted && !valid ? 'is-danger' : 'is-primary'}
                    show={this.isModalShown()}
                    loading={loading}
                    title={mode === modes.new ? 'Add new expense' : 'Edit expense'}
                    handleClose={() => this.hideModal()}
                    handleSave={() => this.handleSave()}>
                    <div className="field">
                        <label className="label">Date</label>
                        <div className="control">
                            <input className="input" type="date" />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Category</label>
                        <div className={submitted && !valid && !category ? 'select is-fullwidth is-danger' : 'select is-fullwidth'}>
                            <select name="category"
                                value={category}
                                onChange={this.handleChange}>
                                <option value="">Please select</option>
                            </select>
                        </div>
                        {
                            submitted && !valid && !category &&
                            <p className="help is-danger">
                                This field is required
                            </p>
                        }
                    </div>
                    <div className="field">
                        <label className="label">Amount</label>
                        <div className="control">
                            <p class="control has-icons-left">
                                <input className={submitted && !valid && !amount ? 'input is-danger' : 'input'}
                                    name="amount"
                                    value={amount}
                                    type="text"
                                    placeholder="Amount"
                                    onChange={this.handleChange} />
                                <span class="icon is-small is-left">
                                    <FontAwesomeIcon icon={faPoundSign} pull="left" />
                                </span>
                            </p>
                        </div>
                        {
                            submitted && !valid && !amount &&
                            <p className="help is-danger">
                                This field is required
                            </p>
                        }
                    </div>
                </Modal>
            </main >
        );
    }
}

export default connect(
    state => state.budgets,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Budgets);