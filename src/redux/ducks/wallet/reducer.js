// Constants
const SET_TIME_BALANCE_START = 'wallet/SET_TIME_BALANCE_START';
const SET_TIME_BALANCE_SUCCESS = 'wallet/SET_TIME_BALANCE_SUCCESS';

const SET_LHT_BALANCE_START = 'wallet/SET_LHT_BALANCE_START';
const SET_LHT_BALANCE_SUCCESS = 'wallet/SET_LHT_BALANCE_SUCCESS';

const SET_ETH_BALANCE_START = 'wallet/SET_ETH_BALANCE_START';
const SET_ETH_BALANCE_SUCCESS = 'wallet/SET_ETH_BALANCE_SUCCESS';

// Reducer
const initialState = {
    time: {
        balance: null,
        isFetching: true
    },
    lht: {
        balance: null,
        isFetching: true
    },
    eth: {
        balance: null,
        isFetching: true
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TIME_BALANCE_START:
            return {
                ...state,
                time: {
                    ...state.time,
                    isFetching: true
                }
            };
        case SET_TIME_BALANCE_SUCCESS:
            return {
                ...state,
                time: {
                    isFetching: false,
                    balance: action.payload
                }
            };
        case SET_LHT_BALANCE_START:
            return {
                ...state,
                lht: {
                    ...state.lht,
                    isFetching: true
                }
            };
        case SET_LHT_BALANCE_SUCCESS:
            return {
                ...state,
                lht: {
                    isFetching: false,
                    balance: action.payload
                }
            };
        case SET_ETH_BALANCE_START:
            return {
                ...state,
                eth: {
                    ...state.eth,
                    isFetching: true
                }
            };
        case SET_ETH_BALANCE_SUCCESS:
            return {
                ...state,
                eth: {
                    isFetching: false,
                    balance: action.payload
                }
            };
        default:
            return state
    }
};

const setTimeBalanceStart = () => ({type: SET_TIME_BALANCE_START});
const setTimeBalanceSuccess = (payload) => ({type: SET_TIME_BALANCE_SUCCESS, payload});

const setLHTBalanceStart = () => ({type: SET_LHT_BALANCE_START});
const setLHTBalanceSuccess = (payload) => ({type: SET_LHT_BALANCE_SUCCESS, payload});

const setETHBalanceStart = () => ({type: SET_ETH_BALANCE_START});
const setETHBalanceSuccess = (payload) => ({type: SET_ETH_BALANCE_SUCCESS, payload});

export default reducer;

export {
    setTimeBalanceStart,
    setTimeBalanceSuccess,
    setLHTBalanceStart,
    setLHTBalanceSuccess,
    setETHBalanceStart,
    setETHBalanceSuccess
}
