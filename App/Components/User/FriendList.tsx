import React from "react";
import { View } from "react-native";
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Item,
  Body,
  Input
} from "native-base";
import { compose, withStateHandlers, withProps, withState } from "recompose";
import { graphql, DataValue, MutationFunc } from "react-apollo";
import { Query, User, UserEdge } from "App/Types/GraphQL";
import Loading from "App/Components/Loading";

import QUERY_FRIENDS from "App/GraphQL/Queries/Users/Friends";
import MUTATE_SEND_FRIEND_REQUEST, {
  updateQueries
} from "App/GraphQL/Mutations/Friends/Request";
import EStyleSheet from "react-native-extended-stylesheet";

import FriendListItem from "./FriendListItem";
import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData
} from "react-native";
import { withUIHelpers, UIContext } from "App/Providers/UIProvider";

interface Props {
  onSelect(users: Array<User>): any;
}

interface ComposedProps {
  data: DataValue<Query>;
  users: Array<UserEdge>;
  selectedUsers: Array<User>;
  toggleUserSelect(user: User): any;
  noResultsText?: string;
  onFriendSearch(text: string): any;
  onAddFriend(user: User): any;
  mutate: MutationFunc;
  ui: UIContext;
}

const SelectableUserList = ({
  data,
  users,
  noResultsText,
  selectedUsers,
  toggleUserSelect,
  onFriendSearch,
  onAddFriend
}: ComposedProps) => (
  <Container>
    <Content>
      {data.loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          <Item rounded style={styles.searchFriendForm}>
            <Input
              style={styles.searchFriendInput}
              placeholder="Search to add a friend"
              onSubmitEditing={(
                event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
              ) => onFriendSearch(event.nativeEvent.text)}
            />
          </Item>
          <View style={styles.controls}>
            <Text note style={styles.label}>
              Friends
            </Text>
          </View>

          <List>
            {users && users.length ? (
              users.map(
                ({ node }) =>
                  node && (
                    <FriendListItem
                      selectable={node.isFriend}
                      selected={Boolean(
                        node &&
                          selectedUsers.map(({ id }) => id).includes(node.id)
                      )}
                      onSelect={toggleUserSelect}
                      onAddFriend={onAddFriend}
                      user={node}
                    />
                  )
              )
            ) : (
              <ListItem style={{ borderBottomWidth: 0 }}>
                <Body>
                  <Text note style={{ textAlign: "center" }}>
                    {noResultsText || "You haven't added any friends yet"}
                  </Text>
                </Body>
              </ListItem>
            )}
          </List>
        </React.Fragment>
      )}
    </Content>
  </Container>
);

const styles = EStyleSheet.create({
  searchFriendForm: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "$colorSecondary",
    marginLeft: 24,
    marginRight: 24,
    marginTop: 8,
    marginBottom: 8
  },
  searchFriendInput: {
    paddingVertical: 0,
    height: 30,
    fontSize: 13
  },
  controls: {
    paddingHorizontal: "$spacingDouble",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default compose<ComposedProps, Props>(
  withState("search", "onFriendSearch", null),
  withUIHelpers,
  graphql(QUERY_FRIENDS),
  graphql(MUTATE_SEND_FRIEND_REQUEST),
  withProps(({ data, ui, mutate }: ComposedProps) => ({
    noResultsText: "You haven't added any friends yet",
    users:
      data.friends && data.friends.edges && data.friends.edges.length
        ? data.friends.edges
        : [],
    onAddFriend: (user: User) =>
      mutate({
        variables: { userIds: [user.id], message: "" },
        // @ts-ignore
        updateQueries
      }).then(() => ui.notifySuccess("Sent"))
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

        onSelect(users);
        return {
          selectedUsers: users
        };
      }
    }
  )
)(SelectableUserList);
