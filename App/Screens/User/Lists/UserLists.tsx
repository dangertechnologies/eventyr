import React from "react";
import { View } from "react-native";
import { Container, Content } from "native-base";
import { compose } from "recompose";
import { withUser, UserContext } from "App/Providers/UserProvider";
import { H3 } from "native-base";
import ListsCollection from "App/Components/List/Collection";
import ListForm from "App/Components/List/Form";
import EStyleSheet from "react-native-extended-stylesheet";
import { NavigationScreenProp, NavigationState } from "react-navigation";

import QUERY_USER_LISTS from "App/GraphQL/Queries/Lists/UserLists";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

interface ComposedProps extends Props {
  currentUser: UserContext;
}

interface State {
  showAddForm: boolean;
}

class ListsScreen extends React.Component<ComposedProps, State> {
  state: State = {
    showAddForm: false
  };

  componentDidMount() {
    // @ts-ignore
    this.props.navigation.dangerouslyGetParent().setParams({
      showAddForm: false,
      onAdd: this.showAddForm,
      onCancel: this.hideAddForm
    });
    console.log(this.props.navigation);
  }

  /** Bubble up to parent navigator so we can decide whether or not to show the add form */
  hideAddForm = () =>
    this.setState({ showAddForm: false }, () =>
      this.props.navigation
        // @ts-ignore
        .dangerouslyGetParent()
        .setParams({ showAddForm: false })
    );

  /** Bubble up to parent navigator so we can decide whether or not to show the add form */
  showAddForm = () =>
    this.setState({ showAddForm: true }, () =>
      this.props.navigation
        // @ts-ignore
        .dangerouslyGetParent()
        .setParams({ showAddForm: true })
    );

  render() {
    const { currentUser } = this.props;

    return (
      <Container>
        <Content>
          {// @ts-ignore
          this.state.showAddForm && (
            <ListForm onCancel={this.hideAddForm} onCreate={this.hideAddForm} />
          )}
          {currentUser.id && (
            <ListsCollection
              query={{
                query: QUERY_USER_LISTS,
                variables: {
                  userId: currentUser.id
                }
              }}
              listEdgeMapper={query => (query.lists && query.lists.edges) || []}
              emptyComponent={
                <View style={styles.empty}>
                  <H3 numberOfLines={2} style={styles.emptyText}>
                    You haven't created any lists yet
                  </H3>
                </View>
              }
            />
          )}
        </Content>
      </Container>
    );
  }
}
const styles = EStyleSheet.create({
  empty: {
    width: "100% - $spacingDouble",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexGrow: 1,
    minHeight: 250,
    alignSelf: "center"
  },

  emptyText: {
    textAlign: "center"
  }
});

export default compose<ComposedProps, Props>(withUser)(ListsScreen);
