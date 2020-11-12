import React, {Suspense} from 'react';
import {Route, Switch} from 'react-router-dom';
import Hoc from './hoc';

// Views
import Home from './components/Home';
import Charts from './components/Charts';

const BaseRouter = () => (
  <Suspense fallback={<div uk-spinner="true" />}>
    <Hoc>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/charts" exact component={Charts} />
      </Switch>
    </Hoc>
  </Suspense>
);

export default BaseRouter;
