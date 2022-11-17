import React from "react";
import Home from "./ui/pages/Home/Home";
import DApp from "./ui/pages/dApp/dApp";

export enum RouteKey {
  Home = "/",
  dApp = "/dApp"
}
// list of all the routes of the App
export const routes = [ {
  key: RouteKey.Home,
  protected: false,
  path: RouteKey.Home,
  component: <Home/>,
}, {
  key: RouteKey.dApp,
  protected: false,
  path: RouteKey.dApp,
  component: <DApp/>,
}]
