import React from "react";
import { compose } from "recompose";
import { withUser, UserContext } from "App/Providers/UserProvider";

import ListsCollection from "App/Components/List/Collection";
import ListForm from "App/Components/List/Form";

interface Props {}

interface ComposedProps extends Props {
  currentUser: UserContext;
}

const ListsTab = ({ currentUser }: ComposedProps) => (
  <React.Fragment>
    <ListForm onCreate={() => null} />
    {currentUser.id && <ListsCollection userId={currentUser.id} />}
  </React.Fragment>
);

export default compose<ComposedProps, Props>(withUser)(ListsTab);
