import React from "react";
import { compose } from "recompose";
import { withStyles, Theme } from "@material-ui/core/styles";

import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Person";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import Menu from "./Menu";

const drawerWidth = 240;

const styles = (theme: Theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
    color: "#FFFFFF"
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexDirection: "column" as "column",
    flexGrow: 1,
    display: "flex",
    paddingTop: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0
  },
  contentShift: {
    display: "flex",
    flexDirection: "column" as "column",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: drawerWidth
  }
});

interface Props {
  children: React.ReactNode;
  title: string;
}

interface ComposedProps extends Props {
  theme: Theme;
  classes: { [key: string]: string };
}

interface State {
  open: boolean;
}

class TopBar extends React.Component<ComposedProps, State> {
  state = {
    open: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme, children, title } = this.props;
    const { open } = this.state;

    return (
      <>
        <AppBar
          position="fixed"
          classes={{
            root: `${classes.appBar} ${open ? classes.appBarShift : ""}`
          }}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              classes={{
                root: `${classes.menuButton} ${open ? classes.hide : ""}`
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="textSecondary" noWrap>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <Menu />
        </Drawer>
        <main
          className={`${classes.content} ${open ? classes.contentShift : ""}`}
        >
          {children}
        </main>
      </>
    );
  }
}

export default compose<ComposedProps, Props>(
  withStyles(styles, { withTheme: true })
)(TopBar);
