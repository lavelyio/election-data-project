import {
  GET_DIFF_DATA,
  GET_DIFF_DATA_FAIL,
  GET_DIFF_DATA_SUCCESS,
} from './actions';
import {updateObject} from '../utils';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  data: [],
  byStateByCandidate: [],
  states: [],
};

const getDataStart = state =>
  updateObject(state, {
    loading: true,
    error: null,
  });

const getDataFail = (state, action) => {
  const {error} = action;
  return updateObject(state, {
    loading: false,
    error,
  });
};

const getDataSuccess = (state, action) => {
  const {data, byStateByCandidate, states} = action;
  return {
    ...state,
    loading: false,
    loaded: true,
    error: null,
    data,
    byStateByCandidate,
    states,
  };
};

const DiffDataReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case GET_DIFF_DATA:
      return getDataStart(state);
    case GET_DIFF_DATA_FAIL:
      return getDataFail(state, action);
    case GET_DIFF_DATA_SUCCESS:
      return getDataSuccess(state, action);
    default:
      return state;
  }
};

export default DiffDataReducer;
