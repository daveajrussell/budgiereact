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
    }
};