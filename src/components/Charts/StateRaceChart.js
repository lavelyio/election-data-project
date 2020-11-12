/* eslint-disable fp/no-mutation */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
import React, {useState, useEffect} from 'react';
import {Bar} from '@nivo/bar';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import {groupArrayBy, sortArrayBy} from '../../features/utils';
import Theme from './Theme';

const playing = {
  background: 'rgb(240 80 110)',
  backgroundHover: 'rgb(200 80 110 / 1)',
};
const paused = {
  background: 'rgb(30 135 240)',
  backgroundHover: 'rgb(30 135 200 / 1)',
};

const PlaybackButton = styled.button`
  box-sizing: border-box;
  width: 36px;
  height: 36px;
  border: none !important;
  border-radius: 500px;
  border-width: 0;
  border-style: none;
  background: ${props =>
    props.isPlaying ? playing.background : paused.background};
  color: white;
  vertical-align: middle;
  display: inline-flex;
  justify-content: center;
  margin: 0 20px;
  align-items: center;
  transition: 0.1s ease-in-out;
  transition-property: color, background-color;

  &:hover {
    background: ${props =>
      props.isPlaying ? playing.backgroundHover : paused.backgroundHover};
  }
  &:focus {
    outline: none;
    border: none;
  }
`;

const RaceBarChart = props => (
  <g transform={`translate(${props.x},${props.y})`}>
    <rect
      x={-3}
      y={7}
      width={props.width}
      height={props.height}
      fill="rgba(0, 0, 0, .07)"
    />
    <rect width={props.width} height={props.height} fill={props.color} />
    <rect
      x={props.width - 5}
      width={5}
      height={props.height}
      fill="#f3f3f3"
      fillOpacity={0.1}
    />
    <text
      x={props.width - 16}
      y={props.height / 2 - 8}
      textAnchor="end"
      dominantBaseline="central"
      fill="#f3f3f3"
      style={{
        fontWeight: 900,
        fontSize: 18,
      }}>
      {`${props.data.indexValue}`}
    </text>
    <text
      x={props.width - 16}
      y={props.height / 2 + 10}
      textAnchor="end"
      dominantBaseline="central"
      format="($,.2s"
      fill="#f3f3f3"
      style={{
        fontWeight: 400,
        fontSize: 18,
      }}>
      {
        // We need to convert the value to match the legend
        //  nivo does not provide a quick way to do this here
        //  so we're using Intl spec
        // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
        new Intl.NumberFormat('en-US').format(props.data.value)
      }
    </text>
  </g>
);

const StateRaceChart = () => {
  const diff = useSelector(store => store.diff);
  const {data, states, byStateByCandidate} = diff;
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedState, setSelectedState] = useState(states[1]);
  const [yearData, updateYearData] = useState([]);
  const [barData, updateBarData] = useState([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(500); // 1 second

  // const dataGenerator = (index = 0, values = []) => DataWalker(index, values)
  const handleRacePlayback = () => setIsPlaying(state => !state);
  const handleStateChange = e => setSelectedState(e.target.value);

  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrent(0);
  };

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        const nextIndex = current + 1;
        if (nextIndex < yearData.length) {
          updateBarData(yearData[nextIndex].values);
          setCurrent(nextIndex);
        } else {
          setCurrent(0);
        }
      }, playbackSpeed);
      return () => clearTimeout(timer);
    }
  }, [current, isPlaying, setCurrent, yearData, playbackSpeed]);

  useEffect(() => {
    if (data && data.length > 0 && current === 0) {
      const byState = sortArrayBy(data, 'timestamp', 'DESC')
        .filter(item => item.state === selectedState)
        .map(item => ({
          ...item,
          color: item.candidate === 'Biden' ? Theme.Biden : Theme.Trump,
        }));

      const sequenced = groupArrayBy(byState, 'timestamp');
      console.log(sequenced);
      updateYearData(sequenced);
      updateBarData(sequenced[0].values);
    }
  }, [current, data, selectedState]);

  const width = document.getElementById('chart-body')?.offsetWidth || 800;
  return (
    <>
      <h3 className="uk-h3 uk-text-lighter">State Race Chart</h3>
      <div className="uk-flex uk-between" style={{alignItems: 'center'}}>
        <div className="uk-flex">
          <PlaybackButton onClick={handleRacePlayback} isPlaying={isPlaying}>
            <i
              uk-icon={isPlaying ? 'ban' : 'play'}
              uk-tooltip={isPlaying ? 'Stop Playing' : 'Start Race'}
            />
          </PlaybackButton>
          <button
            className="uk-icon-button"
            uk-tooltip="Reset the chart back to the first year"
            uk-icon="refresh"
            onClick={resetPlayback}
            type="button"
          />
        </div>
        <div className="uk-flex uk-flex-left" style={{alignItems: 'center'}}>
          <div className="uk-margin uk-margin-right" style={{flexGrow: 0.8}}>
            <label
              className="uk-form-label uk-margin-left"
              htmlFor="selectCategory">
              Set Race by State
            </label>
            <select
              name="selectCategory"
              className="uk-select uk-box-shadow-medium uk-margin-left"
              onChange={handleStateChange}
              defaultValue={selectedState}>
              {states &&
                states.map(state => (
                  <option key={state} name={state} defaultValue={state}>
                    {state}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      {barData && (
        <Bar
          width={width}
          height={300}
          layout="horizontal"
          margin={{top: 40, right: 100, bottom: 20, left: 80}}
          data={barData}
          colors={props =>
            props.indexValue === 'Biden' ? '#0015BC' : '#FF0000'
          }
          indexBy="candidate"
          valueScale={{type: 'linear'}}
          keys={['value']}
          borderColor={{from: 'color', modifiers: [['brighter', 6.5]]}}
          enableGridX
          enableGridY={false}
          axisTop={{
            format: '~s',
          }}
          axisLeft={null}
          axisBottom={null}
          padding={0.3}
          labelTextColor="#f3f3f3"
          isInteractive
          barComponent={RaceBarChart}
          motionStiffness={170}
          motionDamping={26}
          theme={Theme}
        />
      )}
      <h4 className="uk-margin-remove uk-padding-remove uk-text-center">
        TimeStamp:{' '}
        <h5 className="uk-h5 uk-margin-remove uk-text-bold uk-text-danger">
          {yearData[current]?.key?.toLocaleString()}
        </h5>
      </h4>
    </>
  );
};

export default StateRaceChart;
