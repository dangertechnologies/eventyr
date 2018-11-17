import React from "react";
import { compose } from "recompose";
import { Button, Grid, withStyles } from "@material-ui/core";
import GoogleButton from "../Components/LoginButtonGoogle";

import Menu from "../Navigation/TopBar";

interface ComposedProps {
  classes: { [key: string]: string };
}

const LandingPage = ({ classes }: ComposedProps) => (
  <Menu title="Eventyr">
    <Grid container>
      <Grid item xs={12} classes={{ item: classes.header }}>
        <Grid container justify="center" alignItems="flex-end">
          <GoogleButton />
        </Grid>
      </Grid>
    </Grid>
  </Menu>
);

const styles = () => ({
  header: {
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default compose<ComposedProps, {}>(withStyles(styles))(LandingPage);
