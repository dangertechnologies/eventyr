import React, { Component } from "react";
import { View } from "react-native";
import {
  CardItem,
  Left,
  Item,
  Body,
  Right,
  Text,
  Icon,
  Input,
  Button
} from "native-base";
import { compose } from "recompose";
import { graphql, MutationFunc } from "react-apollo";
import { List } from "App/Types/GraphQL";
import { withUser, UserContext } from "App/Providers/UserProvider";
import { withUIHelpers, UIContext } from "App/Providers/UIProvider";
import ListCard from "App/Components/Cards/List";

import MUTATION_CREATE_LIST from "App/GraphQL/Mutations/Lists/Create";

import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  // Preselected Achievements to create list with
  achievementIds?: Array<string>;
  onCreate(list: List): any;
}

interface ComposedProps extends Props {
  currentUser: UserContext;
  mutate: MutationFunc;
  ui: UIContext;
}

interface State {
  title: string;
  visible: boolean;
}

/**
 * Shows a button with "New List" initially, which when clicked
 * is expanded to an empty List card with a text field where
 * the title would otherwise be.
 *
 * Users may create a list by entering a title and hitting submit
 * on the keyboard, or clicking the "Create", and immediately create
 * a list.
 */
class ListForm extends Component<ComposedProps, State> {
  state: State = {
    title: "",
    visible: false
  };

  toggle = () => this.setState({ visible: !this.state.visible });

  createList = () =>
    this.setState({ title: "", visible: false }, () =>
      this.props
        .mutate({
          variables: {
            title: this.state.title,
            achievements: this.props.achievementIds
          },
          refetchQueries: ["UserLists"]
        })
        .then(result =>
          this.props.ui.notifySuccess("New list").then(() => {
            if (
              result.data &&
              result.data.createList &&
              result.data.createList.list
            ) {
              if (this.props.onCreate) {
                this.props.onCreate(result.data.createList.list);
              }
            }
          })
        )
    );

  render() {
    return !this.state.visible ? (
      <View style={styles.buttonContainer}>
        <Button
          iconLeft
          small
          rounded
          style={styles.button}
          onPress={this.toggle}
        >
          <Icon name="add-to-list" type="Entypo" style={styles.icon} />
          <Text>New list</Text>
        </Button>
      </View>
    ) : (
      <ListCard>
        <CardItem>
          <Left>
            <Text note style={{ fontSize: 12 }}>
              New list
            </Text>
          </Left>
          <Right>
            <Text note style={{ fontSize: 12 }}>
              {this.props.currentUser.name}
            </Text>
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            <Input
              placeholder="New list"
              onChangeText={(title: string) => this.setState({ title })}
              value={this.state.title}
              onSubmitEditing={this.createList}
              style={styles.input}
            />
          </Left>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent small rounded onPress={this.toggle}>
              <Text>Cancel</Text>
            </Button>
          </Left>
          <Right>
            <Button small rounded primary onPress={this.createList}>
              <Text>Save</Text>
            </Button>
          </Right>
        </CardItem>
      </ListCard>
    );
  }
}

const styles = EStyleSheet.create({
  input: {
    fontSize: "$sizeH3",
    color: "$colorDisabled",
    fontWeight: "bold"
  },
  icon: {
    color: "$colorSecondary"
  },
  button: {
    backgroundColor: "$colorAccent",
    margin: "$spacing"
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  }
});

export default compose<ComposedProps, Props>(
  graphql(MUTATION_CREATE_LIST),
  withUser,
  withUIHelpers
)(ListForm);
