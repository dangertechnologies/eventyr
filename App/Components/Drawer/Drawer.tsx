import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { View as AnimatedView } from "react-native-animatable";
import { BlurView } from "react-native-blur";

import EStyleSheet from "react-native-extended-stylesheet";
import { Container, Icon } from "native-base";

interface Props {
  children: React.ReactNode;
  maxHeight?: number;
  minHeight?: number;
}

interface State {
  expanded: boolean;
}

class Drawer extends React.Component<Props, State> {
  state: State = {
    expanded: false
  };

  onExpand = () =>
    this.setState(
      { expanded: true },
      () =>
        this.drawer &&
        this.drawer.transitionTo({ height: this.props.maxHeight || 350 })
    );

  onMinimize = () =>
    this.setState(
      { expanded: false },
      () =>
        this.drawer &&
        this.drawer.transitionTo({ height: this.props.minHeight || 129 })
    );

  drawer: AnimatedView | null = null;

  render() {
    return (
      <View style={{ flex: 1 }} pointerEvents="box-none">
        <AnimatedView
          style={styles.formContainer}
          animation="slideInUp"
          duration={1000}
          ref={(instance: any) => {
            this.drawer = instance as AnimatedView;
          }}
        >
          <BlurView blurType="light" style={{ flex: 1 }}>
            <View style={[styles.transparent, styles.form]}>
              <View style={styles.expansionContainer}>
                <TouchableOpacity
                  onPress={
                    this.state.expanded ? this.onMinimize : this.onExpand
                  }
                >
                  <Icon
                    name={this.state.expanded ? "chevron-down" : "chevron-up"}
                    fontSize={20}
                    type="MaterialCommunityIcons"
                  />
                </TouchableOpacity>
              </View>
              <Container style={styles.transparent}>
                {this.props.children}
              </Container>
            </View>
          </BlurView>
        </AnimatedView>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  transparent: { backgroundColor: "transparent" },
  form: { flex: 1, paddingTop: "$spacing / 2" },
  formContainer: {
    height: 129,
    width: "100%",
    borderTopLeftRadius: "$borderRadius",
    borderTopRightRadius: "$borderRadius",
    borderColor: "$borderColor",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    position: "absolute",
    bottom: 0
  },

  expansionContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 20
  },

  scrolledContentContainer: {
    flexGrow: 1
  },

  scrolledContent: {
    flex: 1
  }
});

export default Drawer;
