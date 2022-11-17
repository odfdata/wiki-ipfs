import React from "react";
import Home from "./ui/pages/Home/Home";

export enum RouteKey {
  Home = "/"
}
// list of all the routes of the App
export const routes = [ {
  key: RouteKey.Home,
  protected: false,
  path: RouteKey.Home,
  component: <Home/>,
}]
