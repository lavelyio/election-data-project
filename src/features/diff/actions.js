import {getData} from '../utils';

export const GET_DIFF_DATA = 'GET_DIFF_DATA';
export const GET_DIFF_DATA_SUCCESS = 'GET_DIFF_DATA_SUCCESS';
export const GET_DIFF_DATA_FAIL = 'GET_DIFF_DATA_FAIL';

export const getDataStart = () => ({type: GET_DIFF_DATA, loading: true});

export const getDiffSuccess = ({data, byStateByCandidate, states}) => ({
  type: GET_DIFF_DATA_SUCCESS,
  data,
  byStateByCandidate,
  states,
});

export const getDataFail = error => ({type: GET_DIFF_DATA_FAIL, error});

export const getElectionData = () => async dispatch => {
  console.log('in get election data');
  dispatch(getDataStart());
  try {
    const {mutated, byStateByCandidate} = await getData();
    const states = [...new Set(mutated.map(x => x.state))];
    const data = mutated;
    dispatch(getDiffSuccess({data, byStateByCandidate, states}));
    console.log('sent off');
  } catch (error) {
    console.error('error: ', error);
    getDataFail(error);
  }
};
