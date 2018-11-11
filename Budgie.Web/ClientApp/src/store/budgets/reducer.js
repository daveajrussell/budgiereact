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
            budget: action.budget,
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
        state.budget.transactions.push(action.transaction);
        state.budget.outgoings.map((item) => {
            if (item.category.id !== action.transaction.category.id) {
                return item;
            }

            item.actual += action.transaction.amount;
            item.remaining = item.budgeted - item.actual;
            return item;
        });

        return {
            ...state,
            loading: false
        }
    }

    if (action.type === types.requestEditTransactionType) {
        return {
            ...state,
            loading: true
        }
    }

    if (action.type === types.receiveEditTransactionType) {
        return {
            ...state,
            transaction: action.transaction,
            loading: false
        }
    }

    if (action.type === types.requestDeleteTransactionType) {
        return {
            ...state,
            loading: true
        }
    }

    if (action.type === types.receiveDeleteTransactionType) {
        return {
            ...state,
            transaction: action.transaction,
            loading: false
        }
    }

    if (action.type === types.transactionFailureType) {
        return {
            ...state,
            loading: false
        }
    }

    return state;
};