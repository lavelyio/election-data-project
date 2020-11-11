import React, {useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getElectionData} from '../../features/diff/actions';
import StateRaceChart from '../Charts/StateRaceChart';
import LineChart from '../Charts/StateRaceLine';

const Home = () => {
  const dispatch = useDispatch();
  const diff = useSelector(store => store.diff);
  const {loading, loaded, data, states, error} = diff;
  const getData = useCallback(() => dispatch(getElectionData()), [dispatch]);

  useEffect(() => {
    if (!loading && !loaded) {
      getData();
    }
  }, [loading, loaded, getData, dispatch]);

  return (
    <div className="uk-width-1-1 uk-flex-middle">
      {error && (
        <div className="uk-card">
          <p>We ran into a problem</p>
          <pre>
            <code>{error?.message}</code>
          </pre>
        </div>
      )}
      <h2 className="uk-margin-top uk-h2 uk-text-lighter text">
        {' '}
        Election Voter Counts Broken Down
      </h2>
      {loaded && !loading && (
        <div
          id="chart-body"
          className="text uk-container"
          style={{minHeight: '600px'}}>
          <div className="uk-margin-bottom">
            <StateRaceChart />
          </div>
          <div className="uk-margin-top text">
            <LineChart />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
