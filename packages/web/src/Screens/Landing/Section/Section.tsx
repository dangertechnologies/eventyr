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

const Section = ({ classes, backgroundImage, children }: ComposedProps) => {
  const viewHeight = React.Children.map(children, () => 1).length * 100;

  return (
    <Grid
      container
      classes={{ container: classes.header }}
      className="snapping-section"
      style={{
        height: `${viewHeight}vh`,

        // opacity: visible ? progress + 0.1 : 0,
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        // Background position moves closer to 50% as we scroll
        alignItems: "center"
      }}
      justify="center"
    >
      {children}
    </Grid>
  );
};

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
