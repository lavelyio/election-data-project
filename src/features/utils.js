/* eslint-disable prefer-destructuring */
/* eslint-disable fp/no-mutation */
/* eslint-disable camelcase */
/* eslint-disable fp/no-mutating-methods */
/* eslint-disable no-nested-ternary */
import axios from 'axios';

/**
 * Get our election data for UI
 * 
 * Item:
   ```
    {
        hurdle: "0.5736784598989535"
        hurdle_change: "-0.0038169340187806933"
        hurdle_mov_avg: "0.5363333333333333"
        leading_candidate_name: "Biden"
        leading_candidate_partition: "0"
        leading_candidate_votes: "1604067"
        new_votes: "0"
        precincts_reporting: "1462"
        precincts_total: "1489"
        state: "Arizona (EV: 11)"
        timestamp: "2020-11-07 02:24:13.261000"
        trailing_candidate_name: "Trump"
        trailing_candidate_partition: "0"
        trailing_candidate_votes: "1574206"
        vote_differential: "29861"
        votes_remaining: "180944"
    }
   ```
 */
export const getData = async () => {
  const {data} = await axios.get('results.json');

  const mutated = [];
  data.forEach(state => {
    const state_electoral_split = state.state.split(' (');
    const trailing = {};
    const leading = {};
    leading.candidate = state.leading_candidate_name;
    leading.value = state.leading_candidate_votes;
    leading.timestamp = state.timestamp;
    leading.state = state_electoral_split[0];
    leading.electoralvotes = `(${state_electoral_split[1]}`;

    trailing.candidate = state.trailing_candidate_name;
    trailing.value = state.trailing_candidate_votes;
    trailing.timestamp = state.timestamp;
    trailing.state = state_electoral_split[0];
    trailing.electoralvotes = `(${state_electoral_split[1]}`;

    mutated.push(trailing);
    mutated.push(leading);
  });
  const byStateByCandidate = groupArrayBy(mutated, 'state');
  return {mutated, byStateByCandidate};
};

/**
 * Groups Array by supplied key
 * @param {array} arr - Array to group
 * @param {string} key - Group By Property
 */
export const groupArrayBy = (arr, key) =>
  arr.reduce((rv, x) => {
    const v = key instanceof Function ? key(x) : x[key];
    const el = rv.find(r => r && r.key === v);
    if (el) el.values.push(x);
    else rv.push({key: v, values: [x]});
    return rv;
  }, []);

/**
 * Sorts Array by supplied key
 * @param {array} arr
 * @param {string} key
 * @param {string} dir ASC || DESC
 */
export const sortArrayBy = (arr, key, dir = 'ASC') => {
  if (dir === 'ASC') {
    return arr.sort((a, b) => {
      const x = a[key];
      const y = b[key];
      return y < x ? -1 : y > x ? 1 : 0;
    });
  }
  return arr.sort((a, b) => {
    const x = a[key];
    const y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
};

export const updateObject = (oldObject, updatedProperties) => ({
  ...oldObject,
  ...updatedProperties,
});
