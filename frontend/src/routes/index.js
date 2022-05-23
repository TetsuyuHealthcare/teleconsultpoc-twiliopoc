import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AdminRoute from './AdminRoute';
import AdminLayout from '../layouts/AdminLayout';
import DashboardContainer from '../containers/Admin/DashboardContainer';
import MeetListContainer from '../containers/Admin/MeetListContainer';
import HomeContainer from '../containers/HomeContainer';
import LoginContainer from '../containers/LoginContainer';
import RoomContainer from '../containers/RoomContainer';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <HomeContainer />
        </Route>
        <Route path='/login'>
          <LoginContainer />
        </Route>
        <Route path='/rooms/:id/participants/:participantId'>
          <RoomContainer />
        </Route>
        <AdminRoute path='/admin/:path?' exact>
          <AdminLayout>
            <AdminRoute path='/admin' exact>
              <DashboardContainer />
            </AdminRoute>
            <AdminRoute path='/admin/meets' exact>
              <MeetListContainer />
            </AdminRoute>
          </AdminLayout>
        </AdminRoute>
        <Route path='*' component={() => '404 Not found.'} />
      </Switch>
    </Router>
  );
}
export default Routes;
