import initialState from './initialState';
import * as types from './types'

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
            transactions: action.budget.transactions,
            categories: action.budget.categories,
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
        return {
            ...state,
            transactions: [...state.transactions, action.transaction],
            outgoings: state.outgoings.map((item) => {
                if (item.category.id !== action.transaction.category.id) {
                    return item;
                }

                item.actual += action.transaction.amount;
                item.remaining = item.budgeted - item.actual;
                return item;
            }),
            loading: false
        }
    }

    if (action.type === types.requestEditTransactionType) {
        return {
            ...state
        }
    }

    if (action.type === types.receiveEditTransactionType) {
        const accumulated = state.transactions.reduce((accumulator, currentValue) => {
            if (currentValue.category.id === action.transaction.category.id) {
                return accumulator + currentValue.amount;
            }

            return accumulator;
        }, 0);

        return {
            ...state,
            outgoings: state.outgoings.map((item) => {
                if (item.category.id !== action.transaction.category.id) {
                    return item;
                }

                item.actual = accumulated;
                item.remaining = item.budgeted - item.actual;

                return item;
            }),
            transactions: state.transactions.map((item) => {
                if (item.id !== action.transaction.id) {
                    return item;
                }

                item.amount = action.transaction.amount;
                item.date = action.transaction.date;
                item.category = action.transaction.category;

                return item;
            })
        }
    }

    if (action.type === types.requestDeleteTransactionType) {
        return {
            ...state,
            transactions: state.transactions.map(item => item.id === action.transaction.id ? { ...item, deleting: true } : item)
        }
    }

    if (action.type === types.receiveDeleteTransactionType) {
        const accumulated = state.transactions.reduce((accumulator, currentValue) => {
            if (currentValue.id !== action.transaction.id && currentValue.category.id === action.transaction.category.id) {
                return accumulator + currentValue.amount;
            }
            return accumulator;
        }, 0);

        return {
            ...state,
            outgoings: state.outgoings.map((item) => {
                if (item.category.id !== action.transaction.category.id) {
                    return item;
                }

                item.actual = accumulated;
                item.remaining = item.budgeted - item.actual;

                return item;
            }),
            transactions: state.transactions.filter(transaction => transaction.id !== action.transaction.id)
        }
    }

    if (action.type === types.transactionFailureType) {
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
        return {
            ...state,
            outgoings: state.outgoings.map((item) => {
                if (item.id !== action.outgoing.id) {
                    return item;
                }

                item.budgeted = action.outgoing.budgeted;
                item.remaining = item.budgeted - item.actual;
                return item;
            })
        }
    }

    return state;
};