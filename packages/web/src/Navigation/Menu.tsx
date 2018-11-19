import React from "react";
import { compose } from "recompose";
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemIcon,
  withStyles,
  Grid,
  Typography,
  Avatar,
  Theme
} from "@material-ui/core";

import { RehydratedState, User } from "@eventyr/core";
import HomeIcon from "@material-ui/icons/Home";
import NotificationIcon from "@material-ui/icons/Notifications";
import ListIcon from "@material-ui/icons/List";
import SettingsIcon from "@material-ui/icons/Settings";
import { UserContext } from "@eventyr/core/Providers/UserProvider";

interface Props {}

interface ComposedProps extends Props {
  currentUser: UserContext;
  classes: { [key: string]: string };
}

const Menu = ({ currentUser, classes }: ComposedProps) => (
  <>
    <Grid container classes={{ container: classes.userInfo }}>
      {currentUser && currentUser.avatar ? (
        <Avatar
          sizes="lg"
          src={`${
            process.env.NODE_ENV !== "production"
              ? process.env.BASE_URL_DEV
              : process.env.BASE_URL
          }${currentUser.avatar}`}
          classes={{ root: classes.avatar }}
        />
      ) : null}
      {currentUser && currentUser.name ? (
        <Typography variant="title" color="textSecondary">
          {currentUser.name}
        </Typography>
      ) : null}
    </Grid>
    <Divider />
    <List>
      <ListItem button>
        <ListItemIcon classes={{ root: classes.itemText }}>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" classes={{ primary: classes.itemText }} />
      </ListItem>

      <ListItem button>
        <ListItemIcon classes={{ root: classes.itemText }}>
          <NotificationIcon />
        </ListItemIcon>
        <ListItemText
          primary="Notifications"
          classes={{ primary: classes.itemText }}
        />
      </ListItem>

      <ListItem button>
        <ListItemIcon classes={{ root: classes.itemText }}>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Lists" classes={{ primary: classes.itemText }} />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem button>
        <ListItemIcon classes={{ root: classes.itemText }}>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText
          primary="Settings"
          classes={{ primary: classes.itemText }}
        />
      </ListItem>
    </List>
  </>
);

const styles = (theme: Theme) => ({
  itemText: {
    color: theme.palette.text.secondary
  },

  avatar: {
    width: 80,
    height: 80,
    margin: 10,
    border: `2px solid ${theme.palette.primary.dark}`
  },
  userInfo: {
    marginBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
    flexDirection: "unset" as "unset",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  }
});

export default compose<ComposedProps, Props>(
  User.withUser,
  withStyles(styles)
)(Menu);
