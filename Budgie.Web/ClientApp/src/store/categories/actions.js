import * as types from './types'
import { categoryService } from './services';

export const actionCreators = {

    getAllCategories: () => (dispatch) => {
        dispatch({ type: types.requestAllCategoriesType });

        categoryService
            .getAllCategories()
            .then((categories) => {
                dispatch({ type: types.receiveAllCategoriesType, categories: categories });
            })
            .catch((error) => {
                console.log(error);
                dispatch({ type: types.allCategoriesFailureType });
            });
    },

    createNewCategory: (category) => (dispatch) => {
        dispatch({ type: types.requestNewCategoryType });

        categoryService
            .createNewCategory(category)
            .then((category) => {
                dispatch({ type: types.receiveNewCategoryType, category: category });
            })
            .catch((error) => {
                console.log(error);
                dispatch({ type: types.newCategoryFailureType })
            });
    },

    deleteCategory: (category) => (dispatch) => {
        dispatch({ type: types.requestDeleteCategoryType, category });

        categoryService
            .deleteCategory(category)
            .then(() => {
                dispatch({ type: types.receiveDeleteCategoryType, category: category });
            })
            .catch((error) => {
                console.log(error);
            });
    },

    editCategory: (category) => (dispatch) => {
        dispatch({ type: types.requestEditCategoryType });

        categoryService
            .editCategory(category)
            .then((category) => {
                dispatch({ type: types.receiveEditCategoryType, category: category });
            })
            .catch((error) => {
                console.log(error);
            })
    }
};