import React from 'react';
import {Link} from 'react-router-dom';

const Nav = () => (
  <div
    uk-sticky="show-on-up: true; animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; bottom: #scrollup-dropdown"
    className="uk-sticky uk-sticky-below uk-sticky-fixed">
    <nav className="uk-navbar-container uk-navbar-transparent uk-navbar-sticky">
      <div className="uk-container uk-container-expand">
        <div uk-navbar="true" className="uk-navbar">
          <div className="uk-navbar-left">
            <Link to="/" className="uk-navbar-item uk-logo">
              Election Data Project
            </Link>
          </div>
          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">
              <li className="uk-active">
                <Link to="/home">Home</Link>
              </li>
              <li>
                <a href="#">Pages</a>
                <div className="uk-navbar-dropdown">
                  <ul className="uk-nav uk-navbar-dropdown-nav">
                    <li className="uk-nav-header">Visualizations</li>
                    <li>
                      <Link to="charts">Charts</Link>
                    </li>
                    <li>
                      <a href="#">Data View</a>
                    </li>
                    <li>
                      <a href="#">Download</a>
                    </li>
                    <li className="uk-nav-header">Our Data</li>
                    <li>
                      <a href="#">Sources</a>
                    </li>
                    <li>
                      <a href="#">Legal</a>
                    </li>
                    <li className="uk-nav-header">Source</li>
                    <li>
                      <a href="https://github.com/lavely-io/">
                        GitHub <i uk-icon="icon: github" />
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <a href="#">
                  <i uk-icon="icon: social" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
);

export default Nav;
