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
                dispatch({ type: types.allCategoriesFailureType });
            });
    },

    createNewCategory: (categoryName, categoryType) => (dispatch) => {
        dispatch({ type: types.requestNewCategoryType, categoryName: categoryName, categoryType: categoryType });

        categoryService
            .createNewCategory(categoryName, categoryType)
            .then((category) => {
                dispatch({ type: types.receiveNewCategoryType, category: category });
            })
            .catch((error) => {
                dispatch({ type: types.newCategoryFailureType })
            });
    },

    deleteCategory: (category) => (dispatch) => {
        dispatch({ type: types.requestDeleteCategoryType, category });

        categoryService
            .deleteCategory(category)
            .then(() => {
                dispatch({ type: types.receiveDeleteCategoryType, category });
            })
            .catch((error) => {

            });
    },

    editCategory: (id, name, type) => (dispatch) => {
        dispatch({ type: types.requestEditCategoryType, id });

        categoryService
            .editCategory(id, name, type)
            .then((category) => {
                dispatch({ type: types.receiveEditCategoryType, category });
            })
            .catch((error) => {

            })
    }
};