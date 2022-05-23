import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

function AdminRoute({ children, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}

const mapStateToProps = ({ auth }) => ({
  authenticated: !!auth.currentUser && auth.currentUser.role === 'admin',
});

export default connect(mapStateToProps)(AdminRoute);
