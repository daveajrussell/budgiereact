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

    if (action.type === types.receiveBudgetType) {
        return {
            ...state,
            transaction: action.transaction,
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