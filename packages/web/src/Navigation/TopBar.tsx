import React from "react";
import { compose } from "recompose";
import { withStyles, Theme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Divider,
  IconButton
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Person";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import Menu from "./Menu";
import { UserContext, withUser } from "@eventyr/core/Providers/UserProvider";

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
  title?: string;
  contentRight?: React.ReactNode;
}

interface ComposedProps extends Props {
  theme: Theme;
  classes: { [key: string]: string };
  currentUser: UserContext;
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
    const {
      classes,
      theme,
      children,
      title,
      contentRight,
      currentUser
    } = this.props;
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
            {title ? (
              <Typography variant="h6" color="textSecondary" noWrap>
                {title}
              </Typography>
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                noWrap
                style={{
                  transform: "rotate(-5deg)",
                  fontFamily: "italianno",
                  fontSize: "2.5rem"
                }}
              >
                Eventyr
              </Typography>
            )}
          </Toolbar>
          <Toolbar>
            {contentRight}

            {currentUser.isLoggedIn ? (
              <Button onClick={() => currentUser.logout()}>
                <Typography color="textSecondary">Sign out</Typography>
              </Button>
            ) : (
              <Button
                // @ts-ignore
                component={Link}
                // @ts-ignore
                to="/sign-in"
              >
                <Typography color="textSecondary">Sign in</Typography>
              </Button>
            )}
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
            <Typography
              variant="display1"
              classes={{ root: classes.logoText }}
              color="textSecondary"
            >
              Eventyr
            </Typography>
            <IconButton onClick={this.handleDrawerClose} color="inherit">
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

const styles = (theme: Theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    display: "flex",
    flexDirection: "row" as "row",
    justifyContent: "space-between",
    paddingRight: theme.spacing.unit * 3
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
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.secondary.main,
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
    paddingLeft: theme.spacing.unit * 2
  },

  logoText: {
    fontFamily: "'Italianno', cursive",
    transform: "rotate(-5deg)",
    fontSize: "3rem",
    paddingLeft: "calc(25%)"
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

export default compose<ComposedProps, Props>(
  withUser,
  withStyles(styles, { withTheme: true })
)(TopBar);
