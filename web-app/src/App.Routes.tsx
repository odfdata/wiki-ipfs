import React from "react";
import Home from "./ui/pages/Home/Home";
import Search from "./ui/pages/Search/Search";

export enum RouteKey {
  Home = "/",
  Search = "/search"
}
// list of all the routes of the App
export const routes = [ {
  key: RouteKey.Home,
  protected: false,
  path: RouteKey.Home,
  component: <Home/>,
}, {
  key: RouteKey.Search,
  protected: false,
  path: RouteKey.Search,
  component: <Search/>,
}]
