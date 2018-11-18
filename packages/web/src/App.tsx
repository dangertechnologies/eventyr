import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { PersistentStorage, PersistedData } from "apollo-cache-persist/types";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import green from "@material-ui/core/colors/green";
import white from "@material-ui/core/colors/grey";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RehydratedState, User } from "@eventyr/core";

import LandingPage from "./Screens/Landing";
import ManageCreatedPage from "./Screens/Achievements/Manage/Created";

const theme = createMuiTheme({
  palette: {
    secondary: white,
    primary: green,
    text: {
      secondary: "#FFFFFF"
    }
  },
  overrides: {
    MuiTableCell: {
      head: {
        color: "#333333"
      }
    }
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <RehydratedState.Provider
          storage={
            window.localStorage as PersistentStorage<
              PersistedData<NormalizedCacheObject>
            >
          }
        >
          <User.Provider>
            <BrowserRouter>
              <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/register" />
                <Route
                  path="/achievements/manage"
                  component={ManageCreatedPage}
                />
              </Switch>
            </BrowserRouter>
          </User.Provider>
        </RehydratedState.Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
