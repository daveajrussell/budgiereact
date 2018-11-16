import React from "react";
import Helmet from "react-helmet";

import Header from "./layout/Header";
import Content from "./layout/Content";

const Layout = () => (
  <div>
    <Helmet title="Budgie" />
    <Header />
    <Content />
  </div>
);

export default Layout;