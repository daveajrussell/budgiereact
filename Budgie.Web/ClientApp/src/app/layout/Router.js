import React from "react";
import { Switch, Route } from "react-router-dom";
import { PrivateRoute } from './PrivateRoute';

import Home from "./../Home";
import Login from './../Login';
import Register from './../Register';
import Categories from './../Categories';

export default () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <PrivateRoute exact path="/categories" component={Categories} />
  </Switch>
);