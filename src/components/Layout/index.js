import React from 'react';
import Footer from './components/Footer';
import Nav from './components/Nav';

const AppLayout = props => (
  <>
    <Nav />
    <div className="uk-container-expand detach-root">{props.children}</div>
    <Footer />
  </>
);

export default AppLayout;
