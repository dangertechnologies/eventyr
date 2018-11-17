import React from "react";
import { View } from "react-native";

/** PROVIDERS **/
import { withUser, UserContext } from "@eventyr/core/Providers";

/** COMPONENTS **/
import { Card } from "native-base";

/** UTILS **/
import { compose } from "recompose";
// @ts-ignore

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";
import withLocation, {
  LocationContext
} from "../../Providers/LocationProvider";

interface Props {
  children: React.ReactNode;
  selected?: boolean;
}

interface ComposedProps extends Props {
  location: LocationContext;
  currentUser: UserContext;
}

const ListCard = ({
  selected,
  children
}: ComposedProps & { currentUser: UserContext }) => {
  return (
    <Card transparent style={styles.content}>
      <View style={[styles.card, styles.outerBackgroundCard]} />
      <View style={[styles.card, styles.innerBackgroundCard]} />
      <View style={[styles.card, styles.contentCard]}>
        <View style={[styles.inner, selected && styles.selectedBorder]}>
          {children}
        </View>
      </View>
    </Card>
  );
};
const styles = EStyleSheet.create({
  content: {
    paddingHorizontal: "$spacing",
    marginTop: "$spacing",
    marginBottom: "$spacing"
  },
  card: {
    borderRadius: 8,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "$colorText",
    shadowOpacity: 0.1,
    backgroundColor: "$colorSecondary"
  },
  inner: {
    flex: 1,
    padding: 5,
    borderRadius: 8
  },

  selectedBorder: {
    borderLeftWidth: 5,
    borderLeftColor: "$colorPrimary"
  },

  innerBackgroundCard: {
    width: "95%",
    position: "absolute",
    bottom: -5,
    left: "7%",
    height: 100,
    opacity: 0.8
  },

  outerBackgroundCard: {
    margin: "$spacing",
    width: "90%",
    position: "absolute",
    bottom: -25,
    left: "5%",
    height: 140,
    opacity: 0.7
  },

  contentCard: {},

  editButton: {
    width: "100%",
    height: "100%",
    backgroundColor: "orange",
    borderRadius: 0,
    margin: 0
  },
  deleteButton: {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
    borderRadius: 0,
    margin: 0
  },

  distance: {
    fontSize: 11
  }
});

export default compose<ComposedProps, Props>(
  withLocation(),
  withUser
)(ListCard);
