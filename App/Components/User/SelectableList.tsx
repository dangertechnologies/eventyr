import React from "react";
import { Container, Content, List } from "native-base";
import { compose, withStateHandlers } from "recompose";
import { graphql, DataValue } from "react-apollo";
import { Query, User } from "App/Types/GraphQL";
import Loading from "App/Components/Loading";

import QUERY_USERS_SIMILAR_TRACKING from "App/GraphQL/Queries/Users/Coop";

import UserListItem from "./ListItem";

interface ComposedProps {
  data: DataValue<Query>;
  selectedUsers: Array<User>;
  toggleUserSelect(user: User): any;
}

const SelectableUserList = ({
  data,
  selectedUsers,
  toggleUserSelect
}: ComposedProps) => (
  <Container>
    <Content>
      {data.loading ? (
        <Loading />
      ) : (
        <List>
          {data.users &&
            data.users.edges &&
            data.users.edges.map(
              ({ node }) =>
                node && (
                  <UserListItem
                    selectable
                    selected={Boolean(
                      node &&
                        selectedUsers.map(({ id }) => id).includes(node.id)
                    )}
                    onPress={toggleUserSelect}
                    user={node}
                  />
                )
            )}
        </List>
      )}
    </Content>
  </Container>
);

interface CoopUserSelectProps {
  achievementId: string;
  onSelect(users: Array<User>): any;
}

const CooperationUserSelect = compose<ComposedProps, CoopUserSelectProps>(
  graphql(QUERY_USERS_SIMILAR_TRACKING),
  withStateHandlers(
    {
      selectedUsers: []
    } as Pick<ComposedProps, "selectedUsers">,
    {
      toggleUserSelect: (
        { selectedUsers }: Pick<ComposedProps, "selectedUsers">,
        { onSelect }: any
      ) => (user: User) => {
        const users: Array<User> = selectedUsers
          .map(({ id }) => id)
          .includes(user.id)
          ? selectedUsers.filter(({ id }) => id !== user.id)
          : selectedUsers.concat([user]);

        console.log("Should trigger select now");
        onSelect(users);
        return {
          selectedUsers: users
        };
      }
    }
  )
)(SelectableUserList);

export { CooperationUserSelect };
export default CooperationUserSelect;
