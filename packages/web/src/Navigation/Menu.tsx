import React from "react";
import { compose } from "recompose";
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemIcon,
  withStyles
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
}

const Menu = () => (
  <>
    <List>
      <ListItem button>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <NotificationIcon />
        </ListItemIcon>
        <ListItemText primary="Notifications" />
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Lists" />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem button>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
    </List>
  </>
);

export default compose<ComposedProps, Props>(User.withUser)(Menu);
