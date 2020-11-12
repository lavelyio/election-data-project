import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {ResponsiveLine} from '@nivo/line';
import moment from 'moment';
import {groupArrayBy, sortArrayBy} from '../../features/utils';
import LineToolTip from './LineToolTip';
import Theme from './Theme';

const LineChart = () => {
  const diff = useSelector(store => store.diff);
  const {data, states, byStateByCandidate} = diff;
  const [selectedState, updateSelectedState] = useState(states[1]);

  const valueWithCommas = x =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const getDataByState = (dataSet, state) =>
    groupArrayBy(
      dataSet.filter(item => item.state === state),
      'candidate'
    ).map(itemSet => {
      const color = itemSet.key === 'Biden' ? '#0015BC' : '#FF0000';
      return {
        id: itemSet.key,
        color,
        data: itemSet.values.map(({timestamp, value}, i) => ({
          x: new Date(timestamp),
          y: value,
          candidate: itemSet.key,
          color,
        })),
      };
    });

  const min = Math.min(
    ...data
      .filter(item => item.state === selectedState)
      .map(item => Number(item.value))
  );
  const max = Math.max(
    ...data.filter(item => item.state === selectedState).map(item => item.value)
  );

  const commonProperties = {
    margin: {top: 50, right: 30, bottom: 60, left: 140},
    animate: true,
    enableSlices: 'y',
  };

  const CustomSymbol = ({size, color, borderWidth, borderColor}) => (
    <g>
      <circle
        fill="#fff"
        r={size / 2}
        strokeWidth={borderWidth}
        stroke={borderColor}
      />
      <circle
        r={size / 5}
        strokeWidth={borderWidth}
        stroke={borderColor}
        fill={color}
        fillOpacity={0.35}
      />
    </g>
  );
  const [byCandidate, setByCandidate] = useState(
    getDataByState(data, selectedState)
  );

  const handleStateChange = e => {
    const {value} = e.target;
    updateSelectedState(value);
    setByCandidate(getDataByState(data, value));
  };

  const width = document.getElementById('chart-body')?.offsetWidth || 800;

  return (
    <div className="uk-responsive uk-container" style={{width, height: 500}}>
      <h2 className="uk-h2 uk-text-lighter">
        Linear, timescale data by Country
      </h2>
      <div className="uk-width-1-1 uk-flex uk-flex-left uk-flex-middle uk-flex-auto">
        <div>
          <label
            className="uk-form-label uk-text-left"
            htmlFor="timescale-series">
            Set TimeScale
            <select
              id="timescale-series"
              aria-label="timescale-series"
              name="timescale-series"
              className="uk-select">
              <option>Every 1 hour</option>
              <option>Every 2 hours</option>
              <option>Every 4 hours</option>
              <option>Every 6 hours</option>
              <option>Every 12 hours</option>
            </select>
          </label>
        </div>
        <div className="uk-margin-left">
          <label className="uk-form-label uk-text-left" htmlFor="selectState">
            Select State
            <select
              name="selectState"
              className="uk-select"
              onChange={handleStateChange}
              defaultValue={selectedState}>
              {states &&
                states.map(state => (
                  <option key={state} name={state} defaultValue={state}>
                    {state}
                  </option>
                ))}
            </select>
          </label>
        </div>
      </div>
      <ResponsiveLine
        {...commonProperties}
        colors={{datum: 'color'}}
        data={byCandidate}
        xScale={{
          type: 'time',
          format: 'native',
          useUTC: false,
          precision: 'hour',
        }}
        xFormat="time:%H:%M"
        yScale={{
          type: 'linear',
          stacked: false,
          min,
        }}
        axisLeft={{
          legend: 'Vote Count',
          legendOffset: 5,
          legendPosition: 'end',
          format: value =>
            `${Number(value).toLocaleString('en-US', {
              minimumFractionDigits: 3,
            })}`,
        }}
        axisBottom={{
          format: '%b %d, %H:%M',
          tickValues: 'every 2 hours',
          legendOffset: 2,
          tickRotation: -45,
          tickPadding: 10,
        }}
        curve="monotoneX"
        lineWidth={2}
        enablePointLabel={false}
        pointSymbol={CustomSymbol}
        pointSize={10}
        pointBorderWidth={1}
        pointBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]],
        }}
        useMesh
        enableSlices={false}
        tooltip={LineToolTip}
        legends={[
          {
            anchor: 'top-left',
            direction: 'row',
            justify: false,
            translateX: 20,
            translateY: -25,
            itemDirection: 'left-to-right',
            itemHeight: 30,
            itemWidth: 100,
            itemOpacity: 0.75,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        theme={Theme}
      />
    </div>
  );
};

export default LineChart;
