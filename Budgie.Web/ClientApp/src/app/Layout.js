import React from "react";
import Helmet from "react-helmet";

import Site from "./layout/Site";
import Header from "./layout/Header";
import Content from "./layout/Content";

const Layout = () => (
  <Site>
    <Helmet title="Budgie" />
    <Header />
    <Content />
  </Site>
);

export default Layout;