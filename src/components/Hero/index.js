import React from 'react';

const Hero = () => (
  <div className="uk-cover-container" uk-height-viewport="true">
    <img src="media/edp_bg.png" alt="Election Data Project" uk-cover="true" />
    <div
      className="uk-position-bottom uk-margin-large-bottom"
      style={{bottom: '5em'}}>
      <h1 className="uk-h1 uk-text-center">
        Giving <b>YOU</b> the tools to analyze the data yourself.
      </h1>
      <div className="uk-margin uk-text-center">
        <button
          type="button"
          className="uk-button uk-button-default"
          style={{borderColor: '#932432', color: '#932432'}}>
          Get Started
        </button>
      </div>
    </div>
  </div>
);

export default Hero;
