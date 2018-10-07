import React from "react";
import { TouchableOpacity } from "react-native";
import { Container, Content, Icon } from "native-base";

import { withUser, UserContext } from "App/Providers/UserProvider";
import { UIContext, withUIHelpers } from "App/Providers/UIProvider";

import { compose, withProps } from "recompose";
import { graphql, MutationFunc } from "react-apollo";
import { intersection, isEqual } from "lodash";

import { ListCollection } from "App/Components/List/Collection";
import ListForm from "App/Components/List/Form";

import { List, Query } from "App/Types/GraphQL";
import { NavigationScreenProps, NavigationState } from "react-navigation";
import EStyleSheet from "react-native-extended-stylesheet";

interface Props extends NavigationScreenProps<NavigationState> {}

interface ComposedProps extends Props {
  currentUser: UserContext;
  achievementIds: Array<string>;
  ui: UIContext;
  mutate: MutationFunc;
  data: Query & { loading: boolean };
}

interface State {
  selectedLists: Array<List>;
}

import MUTATE_ADD_TO_LIST from "App/GraphQL/Mutations/Lists/AddToList";
import QUERY_USER_LISTS from "App/GraphQL/Queries/Lists/UserLists";

export const HeaderSaveButton = ({ state }: { state: any }) =>
  state && state.params && state.params.onSave ? (
    <TouchableOpacity onPress={state.params.onSave}>
      <Icon name="playlist-check" style={styles.saveButton} />
    </TouchableOpacity>
  ) : null;

class ListsScreen extends React.Component<ComposedProps, State> {
  state: State = {
    selectedLists: []
  };

  componentWillMount() {
    if (this.props.data.lists && this.props.data.lists.edges) {
      const preselectedLists = this.props.data.lists.edges.filter(
        ({ node }) =>
          node &&
          node.achievements &&
          node.achievements.edges &&
          intersection(
            node.achievements.edges.map(({ node }) => node && node.id),
            this.props.achievementIds
          ).length
      );

      console.log({
        preselectedLists,
        lists: this.props.data.lists,
        achievementId: this.props.achievementIds
      });
      if (preselectedLists.length) {
        this.setState({
          selectedLists: this.state.selectedLists.concat(
            preselectedLists.map(({ node }) => node as List)
          )
        });
      }
    }
  }

  componentWillReceiveProps(nextProps: ComposedProps) {
    if (
      !isEqual(nextProps.data.lists, this.props.data.lists) ||
      !isEqual(nextProps.achievementIds, this.props.achievementIds)
    ) {
      // Preselect lists an Achievement has already been added to:
      if (nextProps.data.lists && nextProps.data.lists.edges) {
        const preselectedLists = nextProps.data.lists.edges.filter(
          ({ node }) =>
            node &&
            node.achievements &&
            node.achievements.edges &&
            intersection(
              node.achievements.edges.map(({ node }) => node && node.id),
              nextProps.achievementIds
            )
        );

        console.log({
          preselectedLists,
          lists: nextProps.data.lists,
          achievementIds: this.props.achievementIds
        });

        if (preselectedLists.length) {
          this.setState({
            selectedLists: this.state.selectedLists.concat(
              preselectedLists.map(({ node }) => node as List)
            )
          });
        }
      }
    }
  }

  headerRight = () => <Icon name="chevron-right" color="#FFFFFF" />;

  onSave = () =>
    this.props
      .mutate({
        variables: {
          achievementIds: this.props.achievementIds,
          listIds: this.state.selectedLists.map(list => list.id)
        },
        refetchQueries: ["UserLists"]
      })
      .then(result => {
        if (
          result.data &&
          result.data.addToList &&
          result.data.addToList.errors &&
          result.data.addToList.errors.length
        ) {
          this.props.ui.notifyError(result.data.addToList.errors[0]);
        } else {
          this.props.ui
            .notifySuccess("Saved")
            .then(() => this.props.navigation.goBack());
        }
      });

  selectList = (list: List) =>
    this.setState(
      {
        selectedLists: this.state.selectedLists.concat(list)
      },
      // @ts-ignore
      () => this.props.navigation.setParams({ onSave: this.onSave })
    );

  deselectList = (list: List) =>
    this.setState(
      {
        selectedLists: this.state.selectedLists.filter(
          (existing: List) => existing.id !== list.id
        )
      },
      () =>
        this.state.selectedLists.length < 1 &&
        // @ts-ignore
        this.props.navigation.setParams({ onSave: null })
    );

  render() {
    console.log({ name: "AddToListsScreen#render", value: this.props });
    return (
      <Container>
        <Content style={styles.content}>
          <ListForm onCreate={this.selectList} />
          <ListCollection
            selectable
            currentUser={this.props.currentUser}
            lists={this.props.data.lists}
            loading={this.props.data.loading}
            userId={this.props.currentUser.id}
            selected={this.state.selectedLists}
            onSelect={this.selectList}
            onDeselect={this.deselectList}
          />
        </Content>
      </Container>
    );
  }
}

const styles = EStyleSheet.create({
  content: {
    paddingTop: "$spacingDouble"
  },

  saveButton: {
    paddingHorizontal: "$spacing",
    color: "$colorSecondary",
    fontSize: "$iconSize"
  }
});

export default compose<ComposedProps, Props>(
  withUser,
  withUIHelpers,
  withProps(({ navigation }: ComposedProps) => ({
    // @ts-ignore
    achievementIds: navigation.getParam("achievementIds")
  })),
  graphql(QUERY_USER_LISTS, {
    options: ({ currentUser }: ComposedProps) => ({
      variables: { userId: currentUser.id }
    })
  }),
  graphql(MUTATE_ADD_TO_LIST)
)(ListsScreen);
