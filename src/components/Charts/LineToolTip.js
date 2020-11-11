import React from 'react';
import styled from 'styled-components';

const LineTip = styled.div`
  display: block;
  position: absolute;
  z-index: 1020;
  box-sizing: border-box;
  min-width: 250px;
  padding: 25px;
  background: #fff;
  color: #666;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
`;

const LineToolTip = ({point}) => (
  <LineTip>
    <dl>
      <dt>Candidate</dt>
      <dd>{point.serieId}</dd>

      <dt>Timestamp</dt>
      <dd>{point.data.x.toString()}</dd>

      <dt> Votes:</dt>
      <dd>
        {Number(point.data.y).toLocaleString('en-US', {
          minimumFractionDigits: 3,
        })}
      </dd>
    </dl>
  </LineTip>
);

export default LineToolTip;
