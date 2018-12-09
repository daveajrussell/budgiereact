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
                if (error.status === 404) {
                    dispatch({ type: types.receiveBudgetNotFoundType });
                } else {
                    logAndHandleFailure(error, dispatch, types.transactionFailureType)
                }
            });
    },

    addBudget: (year, month) => (dispatch) => {
        dispatch({ type: types.requestBudgetType });

        budgetService
            .addBudget(year, month)
            .then((budget) => {
                dispatch({ type: types.receiveBudgetType, budget: budget });
            })
            .catch((error) => logAndHandleFailure(error, dispatch, types.transactionFailureType));
    },

    addTransaction: (transaction) => (dispatch) => {
        dispatch({ type: types.requestNewTransactionType });

        budgetService
            .addTransaction(transaction)
            .then((transaction) => {
                dispatch({ type: types.receiveNewTransactionType, transaction: transaction });
                dispatch({ type: types.recalculateBudgetType });
            })
            .catch((error) => logAndHandleFailure(error, dispatch, types.transactionFailureType));
    },

    editTransaction: (transaction) => (dispatch) => {
        dispatch({ type: types.requestEditTransactionType });

        budgetService
            .editTransaction(transaction)
            .then((transaction) => {
                dispatch({ type: types.receiveEditTransactionType, transaction: transaction });
                dispatch({ type: types.recalculateBudgetType });
            })
            .catch((error) => logAndHandleFailure(error, dispatch, types.transactionFailureType));
    },

    deleteTransaction: (transaction) => (dispatch) => {
        dispatch({ type: types.requestDeleteTransactionType, transaction: transaction });

        budgetService
            .deleteTransaction(transaction)
            .then((transaction) => {
                dispatch({ type: types.receiveDeleteTransactionType, transaction: transaction });
                dispatch({ type: types.recalculateBudgetType });
            })
            .catch((error) => logAndHandleFailure(error, dispatch, types.transactionFailureType));
    },

    editOutgoing: (outgoing) => (dispatch) => {
        dispatch({ type: types.requestEditOutgoingType });

        budgetService
            .editOutgoing(outgoing)
            .then((outgoing) => {
                dispatch({ type: types.receiveEditOutgoingType, outgoing: outgoing });
                dispatch({ type: types.recalculateBudgetType });
            })
            .catch((error) => logAndHandleFailure(error, dispatch, types.transactionFailureType));
    }
};

function logAndHandleFailure(error, dispatch, type) {
    console.log(error, type);
    dispatch({ type: type });
}