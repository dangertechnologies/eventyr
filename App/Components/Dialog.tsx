import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback
} from "react-native";
import { BlurView } from "react-native-blur";

import { BlackPortal } from "react-native-portal";
import { H1 } from "native-base";
import { View } from "react-native-animatable";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  open?: boolean;
  children: React.ReactNode;
  title?: React.ReactNode | string;
  onClose?(): any;
}

const Dialog = ({ open, title, onClose, children }: Props) =>
  !open ? null : (
    <BlackPortal name="dialog">
      <View animation="fadeIn" style={StyleSheet.absoluteFill}>
        <BlurView blurType="light" style={StyleSheet.absoluteFill}>
          <SafeAreaView style={styles.outer}>
            <View style={styles.container}>
              <View style={styles.content}>
                {!title ? null : <H1 style={styles.title}>{title}</H1>}
                {children}
              </View>
            </View>
            {!onClose ? null : (
              <TouchableWithoutFeedback style={styles.close} onPress={onClose}>
                <Icon
                  size={40}
                  style={styles.close}
                  name="close-circle-outline"
                  color="#AAAAAA"
                />
              </TouchableWithoutFeedback>
            )}
          </SafeAreaView>
        </BlurView>
      </View>
    </BlackPortal>
  );

const styles = EStyleSheet.create({
  formContainer: {
    width: "100% - $spacingDouble",
    alignSelf: "center",
    marginTop: "$spacing * -10"
  },

  outer: {
    flex: 1
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },

  content: {
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: "10 * $spacing"
  },

  close: {
    position: "absolute",
    right: 0,
    top: 0,
    margin: "$spacingDouble",
    zIndex: 1000
  },

  title: {
    fontWeight: "bold",
    margin: "$spacing"
  }
});

export default Dialog;
