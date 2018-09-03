import React from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BlurView } from "react-native-blur";

import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { Query, IconEdge } from "graphqlTypes";
import { compose, withState } from "recompose";
import { BlackPortal } from "react-native-portal";
import { H1 } from "native-base";
import { View } from "react-native-animatable";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import AchievementIcon, {
  Props as AchievementIconProps
} from "../AchievementIcon";

interface Props extends AchievementIconProps {
  open: boolean;
  selected?: string;
  data: Query;
  onChange(name: string): any;
  setOpen?(open: boolean): any;
}

const IconPicker = ({
  open,
  data,
  selected,
  onChange,
  setOpen,
  ...iconProps
}: Props) => (
  <React.Fragment>
    <TouchableOpacity onPress={() => setOpen && setOpen(!open)}>
      <AchievementIcon name={selected || "flag-variant"} {...iconProps} />
    </TouchableOpacity>

    {!open ? null : (
      <BlackPortal name="outside">
        <View animation="fadeIn" style={StyleSheet.absoluteFill}>
          <BlurView blurType="light" style={StyleSheet.absoluteFill}>
            <SafeAreaView>
              <H1
                style={{
                  fontWeight: "bold",
                  margin: EStyleSheet.value("$spacing")
                }}
              >
                Pick an icon
              </H1>
              <FlatList
                numColumns={4}
                columnWrapperStyle={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
                data={data.icons ? data.icons.edges : []}
                keyExtractor={(item: IconEdge) =>
                  item && item.node && item.node.name ? item.node.name : "N/A"
                }
                renderItem={({ item }: { item: IconEdge }) =>
                  item && item.node && item.node.name ? (
                    <TouchableOpacity
                      onPress={() => {
                        onChange(item.node ? item.node.name : "flag-variant");
                        if (setOpen) {
                          setOpen(false);
                        }
                      }}
                      key={item.node.name}
                      style={{ margin: EStyleSheet.value("$spacing / 2") }}
                    >
                      <AchievementIcon {...iconProps} name={item.node.name} />
                    </TouchableOpacity>
                  ) : null
                }
              />
            </SafeAreaView>
          </BlurView>
        </View>
      </BlackPortal>
    )}
  </React.Fragment>
);

export default compose<Props, {}>(
  graphql(gql`
    query AllIcons {
      icons {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `),
  withState("open", "setOpen", false)
)(IconPicker);
