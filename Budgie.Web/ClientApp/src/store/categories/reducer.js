import initialState from './initialState'
import * as types from './types'

export default function reducer(state, action) {
    state = state || initialState;

    if (action.type === types.requestAllCategoriesType) {
        return {
            ...state,
            loading: true
        }
    }

    if (action.type === types.receiveAllCategoriesType) {
        return {
            ...state,
            items: action.categories,
            loading: false
        }
    }

    if (action.type === types.allCategoriesFailureType) {
        return {
            ...state,
            loading: false
        }
    }

    if (action.type === types.requestNewCategoryType) {
        return {
            ...state,
            category: {
                name: action.categoryName,
                type: action.categoryType,
            },
            loading: true
        };
    }

    if (action.type === types.receiveNewCategoryType) {
        return {
            ...state,
            items: [...state.items, action.category],
            loading: false,
            success: true
        };
    }

    if (action.type === types.newCategoryFailureType) {
        return {
            ...state,
            loading: false,
            success: false
        }
    }

    if (action.type === types.requestEditCategoryType) {
        return {
            ...state,
            loading: true,
            items: state.items.map(item => item.id === action.id ? { ...item, editing: true } : item)
        }
    }

    if (action.type === types.receiveEditCategoryType) {
        return {
            ...state,
            loading: false,
            success: true,
            items: state.items.map(item => item.id === action.category.id ? { ...item, editing: false, name: action.category.name, type: action.category.type } : item)
        }
    }

    if (action.type === types.requestDeleteCategoryType) {
        return {
            ...state,
            items: state.items.map(item => item.id === action.category.id ? { ...item, deleting: true } : item)
        }
    }

    if (action.type === types.receiveDeleteCategoryType) {
        return {
            items: state.items.filter(item => item.id !== action.category.id)
        };
    }

    return state;
};