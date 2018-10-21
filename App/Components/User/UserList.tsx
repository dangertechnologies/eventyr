import React from "react";
import { Container, Content, List, ListItem, Text, Body } from "native-base";
import { compose, withStateHandlers, withProps } from "recompose";
import { graphql, DataValue } from "react-apollo";
import { Query, User, UserEdge } from "App/Types/GraphQL";
import Loading from "App/Components/Loading";

import QUERY_USERS_SIMILAR_TRACKING from "App/GraphQL/Queries/Users/Coop";
import EStyleSheet from "react-native-extended-stylesheet";

import UserListItem from "./CoopUserListItem";

interface ComposedProps {
  data: DataValue<Query>;
  users: Array<UserEdge>;
  selectedUsers: Array<User>;
  toggleUserSelect(user: User): any;
  noResultsText?: string;
}

const SelectableUserList = ({
  data,
  users,
  noResultsText,
  selectedUsers,
  toggleUserSelect
}: ComposedProps) => (
  <Container>
    <Content>
      {data.loading ? (
        <Loading />
      ) : (
        <List>
          {users && users.length ? (
            users.map(
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
            )
          ) : (
            <ListItem style={{ borderBottomWidth: 0 }}>
              <Body>
                <Text note style={styles.noResults}>
                  {noResultsText || "No users found"}
                </Text>
              </Body>
            </ListItem>
          )}
        </List>
      )}
    </Content>
  </Container>
);

const styles = EStyleSheet.create({
  noResults: { textAlign: "center" }
});

interface UserSelect {
  onSelect(users: Array<User>): any;
}

interface CoopUserSelectProps extends UserSelect {
  achievementId: string;
}

export const CooperationUserSelect = compose<
  ComposedProps,
  CoopUserSelectProps
>(
  graphql(QUERY_USERS_SIMILAR_TRACKING),
  withProps(({ data }: ComposedProps) => ({
    users:
      data.users && data.users.edges && data.users.edges.length
        ? data.users.edges
        : []
  })),
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

export default SelectableUserList;
