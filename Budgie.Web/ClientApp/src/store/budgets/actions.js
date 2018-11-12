import { budgetService } from './services';
import * as types from './types';

export const actionCreators = {
    getBudget: (year, month) => (dispatch) => {
        dispatch({ type: types.requestBudgetType });

        budgetService
            .getBudget(year, month)
            .then((budget) => {
                dispatch({ type: types.receiveBudgetType, budget: budget });
            })
            .catch((error) => {
                dispatch({ type: types.budgetFailureType });
            });
    },

    addTransaction: (transaction) => (dispatch) => {
        dispatch({ type: types.requestNewTransactionType });

        budgetService
            .addTransaction(transaction)
            .then((transaction) => {
                dispatch({ type: types.receiveNewTransactionType, transaction: transaction });
            })
            .catch((error) => {
                dispatch({ type: types.transactionFailureType });
            });
    },

    editTransaction: (transaction) => (dispatch) => {
        dispatch({ type: types.requestEditTransactionType });

        budgetService
            .editTransaction(transaction)
            .then((transaction) => {
                dispatch({ type: types.receiveEditTransactionType, transaction: transaction });
            })
            .catch((error) => {
                dispatch({ type: types.transactionFailureType });
            });
    },

    deleteTransaction: (transaction) => (dispatch) => {
        dispatch({ type: types.requestDeleteTransactionType });

        budgetService
            .deleteTransaction(transaction)
            .then((transaction) => {
                dispatch({ type: types.receiveDeleteTransactionType, transaction: transaction });
            })
            .catch((error) => {
                dispatch({ type: types.transactionFailureType });
            });
    },

    adjustOutgoing: (outgoing) => (dispatch) => {
        dispatch({ type: types.requestAdjustOutgoingType });

        budgetService
            .adjustOutgoing(outgoing)
            .then(() => {
                dispatch({ type: types.receiveAdjustOutgoingType, outgoing: outgoing });
            })
            .catch((error) => {
                dispatch({ type: types.transactionFailureType });
            })
    }
};