import React from "react";
import { compose } from "recompose";
import { Theme, Grid, withStyles } from "@material-ui/core";

interface Props {
  backgroundImage?: string;
  children: React.ReactNode;
  backgroundPosition?: "bottom" | "center" | "top" | number;
}
interface ComposedProps extends Props {
  classes: { [key: string]: string };
  theme: Theme;
}

const Section = ({
  classes,
  backgroundImage,
  backgroundPosition,
  children
}: ComposedProps) => (
  <Grid
    container
    classes={{ container: classes.header }}
    style={{
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      backgroundSize: "cover",
      backgroundPositionY: backgroundPosition || "center",
      alignItems: "center"
    }}
    justify="center"
  >
    {children}
  </Grid>
);

const styles = (theme: Theme) => ({
  header: {
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing.unit * 6,
    borderTop: `${theme.spacing.unit / 2}px solid ${
      theme.palette.background.default
    }`
  },

  shadow: {
    textShadow: "1px 1px 5px #000000"
  }
});

export default compose<ComposedProps, Props>(
  withStyles(styles, { withTheme: true })
)(Section);
