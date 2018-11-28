import React from "react";
import { compose } from "recompose";
import green from "@material-ui/core/colors/green";
import { Typography, Theme, Grid, withStyles } from "@material-ui/core";

interface Props {
  title?: React.ReactNode;
  children: string;
  reverse?: boolean;
  contentAside?: React.ReactNode;
  progress: number;
}
interface ComposedProps extends Props {
  classes: { [key: string]: string };
  theme: Theme;
}

const Section = ({
  classes,
  contentAside,
  reverse,
  children,
  progress,
  title
}: ComposedProps) => {
  let opacity;
  if (progress < 0.1) {
    opacity = progress * (100 * 0.1);
  } else {
    opacity = 1;
  }
  console.log({ progress, opacity });
  return (
    <Grid item xs={12} lg={8}>
      <Grid
        container
        direction={reverse === true ? "row-reverse" : "row"}
        style={{ opacity: opacity > 1 ? 1 - opacity : opacity }}
        classes={{ container: classes.header }}
      >
        <Grid item xs={5} style={{ paddingTop: 64 }}>
          <Typography
            variant="display2"
            color="textSecondary"
            classes={{ display2: classes.shadow }}
          >
            {title}
          </Typography>
          {children.split(/\n\s*\n\s*/).map(paragraph => (
            <Typography
              variant="headline"
              color="textSecondary"
              classes={{ headline: classes.shadow }}
              style={{ marginTop: 8 }}
            >
              {paragraph}
            </Typography>
          ))}
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={5}>
          {contentAside}
        </Grid>
      </Grid>
    </Grid>
  );
};

const styles = (theme: Theme) => ({
  header: {
    minHeight: `calc(${window.screen.height}px - 256px)`,

    padding: theme.spacing.unit * 6
  },

  shadow: {
    textShadow: "1px 1px 5px #000000"
  }
});

export default compose<ComposedProps, Props>(
  withStyles(styles, { withTheme: true })
)(Section);
