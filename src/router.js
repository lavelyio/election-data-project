import React, {Suspense} from 'react';
import {Route, Switch} from 'react-router-dom';
import Hoc from './hoc';

// Views
import Home from './components/Home';

const BaseRouter = () => (
  <Suspense fallback={<div uk-spinner="true" />}>
    <Hoc>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/home" component={Home} />
      </Switch>
    </Hoc>
  </Suspense>
);

export default BaseRouter;
