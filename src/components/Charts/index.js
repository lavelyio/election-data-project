import React, {useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getElectionData} from '../../features/diff/actions';
import StateRaceChart from './StateRaceChart';
import LineChart from './StateRaceLine';

const Charts = () => {
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
    <div className="uk-container">
      <h2 className="uk-margin-top uk-margin-left uk-h2 uk-text-lighter">
        Election Voter Counts Broken Down
      </h2>
      {loaded && !loading && (
        <div
          id="chart-body"
          className="text uk-container"
          style={{minHeight: '600px'}}>
          <div className="uk-margin-large-bottom uk-section">
            <StateRaceChart />
          </div>
          <div className="uk-margin-top uk-margin-large-bottom">
            <LineChart />
          </div>
          <div className="uk-margin-top uk-margin-large-bottom">
            More Coming
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;
