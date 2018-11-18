import React from "react";

import { Grid, Paper, Typography, Toolbar, Button } from "@material-ui/core";
import { User } from "@eventyr/core";
import { UserContext } from "@eventyr/core/Providers/UserProvider";
import { Achievement } from "@eventyr/graphql";
import { withState, compose, withStateHandlers } from "recompose";

import NearbyAchievementsProvider from "../../../DataProviders/NearbyAchievementsProvider";
import Menu from "../../../Navigation/TopBar";
import AchievementsTable from "../../../Components/AchievementsTable";

import EditAsYAML from "./YAML";

interface Props {}

interface InnerProps extends Props {
  currentUser: UserContext;
  editPaneOpen: boolean;
  toggleEditPane(): any;
}

const Page = ({ currentUser, editPaneOpen, toggleEditPane }: InnerProps) =>
  !currentUser.id || currentUser.id === "0" ? (
    <span>{JSON.stringify(currentUser)}</span>
  ) : (
    <Menu title="Manage Achievements">
      <NearbyAchievementsProvider
        latitude={parseFloat("59.917625")}
        longitude={parseFloat("10.730332")}
      >
        {({ data }) => (
          <>
            <Paper>
              <Grid container>
                <Grid item xs={12}>
                  <Toolbar>
                    <Button onClick={toggleEditPane}>
                      <Typography>Edit as YAML</Typography>
                    </Button>
                  </Toolbar>
                  {editPaneOpen ? (
                    <EditAsYAML
                      onClose={toggleEditPane}
                      open={editPaneOpen}
                      existingAchievements={
                        data ? data.map(({ node }) => node as Achievement) : []
                      }
                    />
                  ) : (
                    <AchievementsTable
                      achievements={
                        data ? data.map(({ node }) => node as Achievement) : []
                      }
                    />
                  )}
                </Grid>
              </Grid>
            </Paper>
          </>
        )}
      </NearbyAchievementsProvider>
    </Menu>
  );

export default compose<InnerProps, Props>(
  User.withUser,
  withStateHandlers(
    { editPaneOpen: false },
    {
      toggleEditPane: ({ editPaneOpen }) => () => ({
        editPaneOpen: !editPaneOpen
      })
    }
  )
)(Page);
