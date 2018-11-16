import React from "react";
import { Switch, Route } from "react-router-dom";
import { PrivateRoute } from './PrivateRoute';

import Dashboard from "../Dashboard";
import Login from './../Login';
import Register from './../Register';
import Categories from './../Categories';
import Budget from './../Budget';

export default () => (
  <Switch>
    <PrivateRoute exact path="/" component={Dashboard} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <PrivateRoute exact path="/categories" component={Categories} />
    <PrivateRoute exact path="/budget" component={Budget} />
  </Switch>
);