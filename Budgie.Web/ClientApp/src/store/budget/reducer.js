import initialState from './initialState';
import * as types from './types';

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
            incomeVsExpenditure: action.budget.incomeVsExpenditure,
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
        return {
            ...state,
            transactions: [...state.transactions, action.transaction],
            loading: false
        }
    }

    if (action.type === types.requestEditTransactionType) {
        return {
            ...state
        }
    }

    if (action.type === types.receiveEditTransactionType) {
        return {
            ...state,
            transactions: state.transactions.map((item) => {
                if (item.id !== action.transaction.id) return item;

                return {
                    ...item,
                    amount: action.transaction.amount,
                    date: action.transaction.date,
                    category: action.transaction.category
                }
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
        return {
            ...state,
            transactions: state.transactions.filter(transaction => transaction.id !== action.transaction.id)
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
                if (item.id !== action.outgoing.id) return item;

                const budgeted = action.outgoing.budgeted;

                return {
                    ...item,
                    budgeted: budgeted,
                    remaining: budgeted - item.actual
                }
            })
        }
    }

    if (action.type === types.recalculateBudgetType) {
        const totalBudgeted = state.outgoings
            .reduce((accumulator, outgoing) => {
                return accumulator + outgoing.budgeted;
            }, 0);

        const totalIncomes = state.transactions
            .filter(transaction => transaction.category.type === 2)
            .reduce((accumulator, transaction) => {
                return accumulator + transaction.amount;
            }, 0);

        const totalActuals = state.transactions
            .filter(transaction => transaction.category.type !== 2)
            .reduce((accumulator, transaction) => {
                return accumulator + transaction.amount;
            }, 0);

        const outgoings = state.outgoings.map((outgoing) => {
            const accumulated = state.transactions
                .filter(transaction => transaction.category.id === outgoing.category.id)
                .reduce((accumulator, transaction) => {
                    return accumulator + transaction.amount;
                }, 0);

            return {
                ...outgoing,
                actual: accumulated,
                remaining: outgoing.budgeted - accumulated
            }
        }, state);

        const incomes = state.incomes.map((income) => {
            const accumulated = state.transactions
                .filter(transaction => transaction.category.id === income.category.id)
                .reduce((accumulator, transaction) => {
                    return accumulator + transaction.amount;
                }, 0);

            return {
                ...income,
                actual: accumulated
            }
        }, state);

        return {
            ...state,
            outgoings: outgoings,
            incomes: incomes,
            totalBudgeted: totalBudgeted,
            totalActuals: totalActuals,
            totalRemaining: totalBudgeted - totalActuals,
            incomeVsExpenditure: totalIncomes - totalActuals
        }
    }

    if (action.type === types.transactionFailureType || action.type === types.budgetFailureType) {
        return {
            ...state,
            loading: false
        }
    }

    return state;
};