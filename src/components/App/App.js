import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import AppRouter from '../../router';
import AppLayout from '../Layout';

const App = () => (
  <Router>
    <AppLayout>
      <AppRouter />
    </AppLayout>
  </Router>
);

export default App;
