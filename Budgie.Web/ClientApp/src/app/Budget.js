import React, { Component } from "react";
import { Modal, CollapsibleDiv, InlineEditor } from './components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from './../store/budget/actions';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPoundSign, faCalendar } from '@fortawesome/free-solid-svg-icons'
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar';
import accounting from 'accounting';

const modes = {
    edit: 'edit',
    new: 'new'
}

class Budget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDate: moment(),
            id: 0,
            submitted: false,
            valid: false,
            show: false,
            mode: modes.new,
            category: 0,
            amount: '',
            date: ''
        };
    }

    componentDidMount() {
        const { loading } = this.props;
        const { currentDate } = this.state;

        if (!loading) {
            this.props.getBudget(currentDate.year(), currentDate.month() + 1);
        }
    }

    showModal() {
        this.setState({
            submitted: false,
            show: true,
            mode: modes.new,
            id: 0,
            category: 0,
            amount: '',
            date: ''
        });
    }

    hideModal() {
        this.setState({
            submitted: false,
            show: false,
            id: 0,
            category: 0,
            amount: '',
            date: ''
        });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSave() {
        const { mode, id, category, amount, date } = this.state;

        if (category && amount && date) {
            this.setState({
                submitted: true,
                valid: true
            });

            const transaction = {
                id: id,
                budgetId: 1,
                category: {
                    id: parseInt(category)
                },
                date: moment(date, 'DD/MM/YYYY').format('MM/DD/YYYY'),
                amount: parseFloat(amount)
            };

            if (mode === modes.new) {
                this.props.addTransaction(transaction);
            } else if (mode === modes.edit) {
                this.props.editTransaction(transaction);
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

    renderBudget() {
        return (
            <div className="tile is-ancestor">
                {this.renderOutgoings()}
                {this.renderExpenses()}
            </div>
        )
    }

    handleOutgoingEdit(value, o) {
        const outgoing = {
            id: o.id,
            budgeted: value
        };

        this.props.editOutgoing(outgoing);
    }

    handleTransactionEdit(value, t) {
        const transaction = {
            id: t.id,
            amount: value,
            date: t.date,
            category: t.category,
            budgetId: t.budgetId
        };

        this.props.editTransaction(transaction);
    }

    deleteTransaction(transaction) {
        this.props.deleteTransaction(transaction);
    }

    renderOutgoings() {
        const { outgoings, totalBudgeted, totalActuals, totalRemaining } = this.props;
        return (
            <div className="tile is-4 is-vertical is-parent">
                <div className="tile is-child box">
                    <CollapsibleDiv title="Outgoings">
                        {outgoings.map((outgoing) => {
                            return (
                                <table key={outgoing.id} className="table is-striped">
                                    <thead>
                                        <tr>
                                            <th colSpan="3">
                                                {outgoing.category.name}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Budgeted
                                            </td>
                                            <td>
                                                <InlineEditor
                                                    id={outgoing.id}
                                                    value={accounting.formatMoney(outgoing.budgeted)}
                                                    handleSave={(value) => this.handleOutgoingEdit(value, outgoing)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Actual
                                            </td>
                                            <td>
                                                {accounting.formatMoney(outgoing.actual)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Remaining
                                            </td>
                                            <td className={outgoing.remaining < 0 ? 'has-text-danger' : 'has-text-success'}>
                                                {accounting.formatMoney(outgoing.remaining)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )
                        })}
                    </CollapsibleDiv>
                </div>
                <div className="tile is-child box">
                    <CollapsibleDiv title="Totals">
                        <table className="table is-striped">
                            <tbody>
                                <tr>
                                    <td>
                                        Budgeted
                                    </td>
                                    <td>
                                        {accounting.formatMoney(totalBudgeted)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Actual
                                    </td>
                                    <td>
                                        {accounting.formatMoney(totalActuals)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Remaining
                                    </td>
                                    <td className={totalRemaining < 0 ? 'has-text-danger' : 'has-text-success'}>
                                        {accounting.formatMoney(totalRemaining)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </CollapsibleDiv>
                </div>
            </div>
        );
    }

    renderExpenses() {
        return (
            <div className="tile is-parent">
                <div className="tile is-child box">
                    <h4>
                        Expenses
                        <button className="button is-small is-primary is-pulled-right" onClick={() => this.showModal()}>Add</button>
                    </h4>
                    {this.renderExpenseListView()}
                </div>
            </div>
        );
    }

    renderTransactions() {
        const { transactions } = this.props;
        transactions.sort((a, b) => {
            return moment(a.date, 'YYYY-MM-DD') - moment(b.date, 'YYYY-MM-DD');
        });

        return (
            transactions.map((transaction) =>
                <tr key={transaction.id}>
                    <td>{moment(transaction.date, 'YYYY-MM-DDT00:00:00').format('DD/MM/YYYY')}</td>
                    <td>{this.getCategory(transaction)}</td>
                    <td>
                        <InlineEditor
                            id={transaction.id}
                            value={accounting.formatMoney(transaction.amount)}
                            handleSave={(value) => this.handleTransactionEdit(value, transaction)} />
                    </td>
                    <td>
                        <p className="control">
                            <button className={'button is-small is-danger ' + (transaction.deleting ? 'is-loading' : '')}
                                onClick={() => !transaction.deleting && this.deleteTransaction(transaction)}>Delete</button>
                        </p>
                    </td>
                </tr>
            )
        );
    }

    renderExpenseListView() {
        const { transactions } = this.props;
        if (transactions) {
            return (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTransactions()}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    getCategory(item) {
        const { categories } = this.props;
        const category = categories.find((category) => {
            return category.id === item.category.id;
        });

        return category.name;
    }

    renderCategories() {
        const { categories } = this.props;
        if (categories) {
            return (
                categories.map((category) => {
                    return (<option key={category.id} value={category.id}>{category.name}</option>)
                })
            );
        }
    }

    render() {
        const { loading } = this.props;
        const { currentDate, mode, category, amount, date, valid, submitted } = this.state;
        const options = {
            showHeader: false,
            showFooter: false,
            todayButton: false,
            clearButton: false,
            displayMode: 'dialog',
            dateFormat: 'DD/MM/YYYY',
            minDate: currentDate.startOf('month').format('DD/MM/YYYY'),
            maxDate: currentDate.endOf('month').format('DD/MM/YYYY')
        };
        const calendars = bulmaCalendar.attach('[type="date"]', options);
        calendars.forEach(calendar => {
            calendar.on('date:selected', date => {
                this.setState({ date: moment(date.start).format('DD/MM/YYYY') });
            });
        });
        return (
            <main>
                <h3>Budget - {`${currentDate.format('MMMM')}/${currentDate.year()}`}</h3>
                {
                    loading ?
                        <div>Loading...</div>
                        :
                        this.renderBudget()
                }
                <Modal buttonClass={submitted && !valid ? 'is-danger' : 'is-primary'}
                    show={this.isModalShown()}
                    loading={loading}
                    title={mode === modes.new ? 'Add new expense' : 'Edit expense'}
                    handleClose={() => this.hideModal()}
                    handleSave={() => this.handleSave()}>
                    <div className="field">
                        <label className="label">Date</label>
                        <div className="control">
                            <p className="control has-icons-left">
                                <input className={submitted && !valid && !date ? 'input is-danger' : 'input'}
                                    type="date"
                                    placeholder="dd/mm/yyyy"
                                    value={date}
                                    onChange={(e) => this.handleChange(e)} />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faCalendar} pull="left" />
                                </span>
                            </p>
                        </div>
                        {
                            submitted && !valid && !date &&
                            <p className="help is-danger">
                                This field is required
                            </p>
                        }
                    </div>
                    <div className="field">
                        <label className="label">Category</label>
                        <div className={submitted && !valid && !category ? 'select is-fullwidth is-danger' : 'select is-fullwidth'}>
                            <select name="category"
                                value={category}
                                onChange={(e) => this.handleChange(e)}>
                                <option value="">Please select</option>
                                {this.renderCategories()}
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
                            <p className="control has-icons-left">
                                <input className={submitted && !valid && !amount ? 'input is-danger' : 'input'}
                                    name="amount"
                                    value={amount}
                                    type="text"
                                    placeholder="Amount"
                                    onChange={(e) => this.handleChange(e)} />
                                <span className="icon is-small is-left">
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
    state => state.budget,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Budget);