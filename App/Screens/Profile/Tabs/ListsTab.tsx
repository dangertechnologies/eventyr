import React from "react";
import { View } from "react-native";
import { compose } from "recompose";
import { withUser, UserContext } from "App/Providers/UserProvider";
import { H3 } from "native-base";
import ListsCollection from "App/Components/List/Collection";
import ListForm from "App/Components/List/Form";
import EStyleSheet from "react-native-extended-stylesheet";

interface Props {}

interface ComposedProps extends Props {
  currentUser: UserContext;
}

const ListsTab = ({ currentUser }: ComposedProps) => (
  <React.Fragment>
    <ListForm onCreate={() => null} />
    {currentUser.id && (
      <ListsCollection
        userId={currentUser.id}
        emptyComponent={
          <View style={styles.empty}>
            <H3 numberOfLines={2} style={styles.emptyText}>
              You haven't created any lists yet
            </H3>
          </View>
        }
      />
    )}
  </React.Fragment>
);

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

export default compose<ComposedProps, Props>(withUser)(ListsTab);
