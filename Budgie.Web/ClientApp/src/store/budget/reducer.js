import initialState from './initialState';
import * as types from './types';

function shouldCountTransaction(transaction) {
    return transaction.category.type !== 2;
}

export default function reducer(state, action) {
    state = state || initialState;

    if (action.type === types.requestBudgetType) {
        return {
            ...state,
            loading: true
        }
    }

    if (action.type === types.receiveBudgetType) {
        return {
            ...state,
            outgoings: action.budget.outgoings,
            incomes: action.budget.incomes,
            transactions: action.budget.transactions,
            categories: action.budget.categories,
            totalBudgeted: action.budget.totalBudgeted,
            totalActuals: action.budget.totalActuals,
            totalRemaining: action.budget.totalBudgeted - action.budget.totalActuals,
            loading: false
        }
    }

    if (action.type === types.requestNewTransactionType) {
        return {
            ...state,
            loading: true
        }
    }

    if (action.type === types.receiveNewTransactionType) {
        const totalBudgeted = state.outgoings.reduce((accumulator, outgoing) => {
            return accumulator + outgoing.budgeted;
        }, 0);

        let totalActuals = state.transactions.reduce((accumulator, transaction) => {
            if (shouldCountTransaction(transaction)) {
                return accumulator + transaction.amount;
            }

            return accumulator;
        }, 0);

        if (action.transaction.category.type !== 2) {
            totalActuals += action.transaction.amount;
        }

        return {
            ...state,
            transactions: [...state.transactions, action.transaction],
            outgoings: state.outgoings.map((item) => {
                if (item.category.id !== action.transaction.category.id) {
                    return item;
                }

                const actual = item.actual + action.transaction.amount;

                return {
                    ...item,
                    actual: actual,
                    remaining: item.budgeted - actual
                }
            }),
            incomes: state.incomes.map((item) => {
                if (item.category.id !== action.transaction.category.id) {
                    return item;
                }

                debugger;

                const actual = item.actual + action.transaction.amount;

                return {
                    ...item,
                    actual: actual
                }
            }),
            totalBudgeted: totalBudgeted,
            totalActuals: totalActuals,
            totalRemaining: totalBudgeted - totalActuals,
            loading: false
        }
    }

    if (action.type === types.requestEditTransactionType) {
        return {
            ...state
        }
    }

    if (action.type === types.receiveEditTransactionType) {
        const accumulated = state.transactions.reduce((accumulator, transaction) => {
            if (shouldCountTransaction(transaction) && transaction.id !== action.transaction.id && transaction.category.id === action.transaction.category.id) {
                return accumulator + transaction.amount;
            }

            return accumulator;
        }, 0);

        const totalBudgeted = state.outgoings.reduce((accumulator, outgoing) => {
            return accumulator + outgoing.budgeted;
        }, 0);

        const totalActuals = state.transactions.reduce((accumulator, transaction) => {
            if (shouldCountTransaction(transaction) && transaction.id !== action.transaction.id && transaction.category.id === action.transaction.category.id) {
                return accumulator + transaction.amount;
            }

            if (shouldCountTransaction(transaction)) {
                return accumulator + action.transaction.amount;
            }

            return accumulator;
        }, 0);

        return {
            ...state,
            outgoings: state.outgoings.map((item) => {
                if (item.category.id !== action.transaction.category.id) {
                    return item;
                }

                const actual = accumulated + action.transaction.amount;

                return {
                    ...item,
                    actual: actual,
                    remaining: item.budgeted - actual
                }
            }),
            incomes: state.incomes.map((item) => {
                if (item.category.id !== action.transaction.category.id) {
                    return item;
                }

                const actual = item.actual + action.transaction.amount;

                return {
                    ...item,
                    actual: actual
                }
            }),
            transactions: state.transactions.map((item) => {
                if (item.id !== action.transaction.id) {
                    return item;
                }

                return {
                    ...item,
                    amount: action.transaction.amount,
                    date: action.transaction.date,
                    category: action.transaction.category
                }
            }),
            totalBudgeted: totalBudgeted,
            totalActuals: totalActuals,
            totalRemaining: totalBudgeted - totalActuals
        }
    }

    if (action.type === types.requestDeleteTransactionType) {
        return {
            ...state,
            transactions: state.transactions.map(item => item.id === action.transaction.id ? { ...item, deleting: true } : item)
        }
    }

    if (action.type === types.receiveDeleteTransactionType) {
        const accumulated = state.transactions.reduce((accumulator, transaction) => {
            if (shouldCountTransaction(transaction) && transaction.id !== action.transaction.id && transaction.category.id === action.transaction.category.id) {
                return accumulator + transaction.amount;
            }
            return accumulator;
        }, 0);

        const totalBudgeted = state.outgoings.reduce((accumulator, outgoing) => {
            return accumulator + outgoing.budgeted;
        }, 0);

        const totalActuals = state.transactions.reduce((accumulator, transaction) => {
            if (shouldCountTransaction(transaction) && transaction.id !== action.transaction.id && transaction.category.id === action.transaction.category.id) {
                return accumulator + transaction.amount;
            }

            return accumulator - action.transaction.amount;
        }, 0);

        return {
            ...state,
            outgoings: state.outgoings.map((item) => {
                if (item.category.id !== action.transaction.category.id) {
                    return item;
                }

                const actual = accumulated;

                return {
                    ...item,
                    actual: accumulated,
                    remaining: item.budgeted - actual
                }
            }),
            incomes: state.incomes.map((item) => {
                if (item.category.id !== action.transaction.category.id) {
                    return item;
                }

                const actual = item.actual + action.transaction.amount;

                return {
                    ...item,
                    actual: actual
                }
            }),
            transactions: state.transactions.filter(transaction => transaction.id !== action.transaction.id),
            totalBudgeted: totalBudgeted,
            totalActuals: totalActuals,
            totalRemaining: totalBudgeted - totalActuals
        }
    }

    if (action.type === types.transactionFailureType || action.type === types.budgetFailureType) {
        return {
            ...state,
            loading: false
        }
    }

    if (action.type === types.requestEditOutgoingType) {
        return {
            ...state
        }
    }

    if (action.type === types.receiveEditOutgoingType) {
        const totalBudgeted = state.outgoings.reduce((accumulator, outgoing) => {
            if (outgoing.id !== action.outgoing.id) {
                return accumulator + outgoing.budgeted;
            }
            return accumulator + action.outgoing.budgeted;
        }, 0);

        const totalActuals = state.outgoings.reduce((accumulator, outgoing) => {
            return accumulator + outgoing.actual;
        }, 0);

        return {
            ...state,
            outgoings: state.outgoings.map((item) => {
                if (item.id !== action.outgoing.id) {
                    return item;
                }

                const budgeted = action.outgoing.budgeted;

                return {
                    ...item,
                    budgeted: budgeted,
                    remaining: budgeted - item.actual
                }
            }),
            incomes: state.incomes.map((item) => {
                if (item.category.id !== action.transaction.category.id) {
                    return item;
                }

                const actual = item.actual + action.transaction.amount;

                return {
                    ...item,
                    actual: actual
                }
            }),
            totalBudgeted: totalBudgeted,
            totalRemaining: totalBudgeted - totalActuals
        }
    }

    return state;
};