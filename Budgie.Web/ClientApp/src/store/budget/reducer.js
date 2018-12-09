import initialState from './initialState';
import * as types from './types';

export default function reducer(state, action) {
    state = state || initialState;

    switch (action.type) {
        case types.requestBudgetType:
        case types.requestNewTransactionType:
            return { ...state, loading: true }
        case types.receiveBudgetType:
            return reduceDefaultReceiveState(state, action);
        case types.receiveNewTransactionType:
            return reduceReceiveNewTransactionState(state, action);
        case types.requestEditTransactionType:
            return { ...state }
        case types.receiveEditTransactionType:
            return reduceReceiveEditTransactionState(state, action);
        case types.requestDeleteTransactionType:
            return reduceRequestDeleteTransactionState(state, action);
        case types.receiveDeleteTransactionType:
            return reduceReceiveDeleteTransactionState(state, action);
        case types.requestEditOutgoingType:
            return { ...state }
        case types.receiveEditOutgoingType:
            return reduceReceiveEditOutgoingState(state, action);
        case types.recalculateBudgetType:
            return reduceRecalculatedState(state);
        case types.transactionFailureType:
            return { ...state, loading: false }
        case types.receiveBudgetNotFoundType:
            return reduceEmptyBudgetState(state);
        default:
            return state;
    }
};

function reduceDefaultReceiveState(state, action) {
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

function reduceEmptyBudgetState(state) {
    return {
        ...state,
        outgoings: [],
        incomes: [],
        transactions: [],
        categories: [],
        incomeVsExpenditure: 0,
        totalBudgeted: 0,
        totalActuals: 0,
        totalRemaining: 0,
        loading: false
    }
}

function reduceReceiveNewTransactionState(state, action) {
    return {
        ...state,
        transactions: [...state.transactions, action.transaction],
        loading: false
    }
}

function reduceReceiveEditTransactionState(state, action) {
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

function reduceRequestDeleteTransactionState(state, action) {
    return {
        ...state,
        transactions: state.transactions.map(item => item.id === action.transaction.id ? { ...item, deleting: true } : item)
    }
}

function reduceReceiveDeleteTransactionState(state, action) {
    return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.transaction.id)
    }
}

function reduceReceiveEditOutgoingState(state, action) {
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

function reduceRecalculatedState(state) {
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