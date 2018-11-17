import React from "react";

/** COMPONENTS **/
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from "react-native";
import { BlurView } from "react-native-blur";
import { BlackPortal } from "react-native-portal";
import { H1 } from "native-base";
import { View } from "react-native-animatable";
import AchievementIcon from "App/Components/AchievementIcon";

/** UTILS **/
import { graphql } from "react-apollo";

/** TYPES **/
import { Query } from "@eventyr/graphql";
import { compose, withState } from "recompose";
import { Props as AchievementIconProps } from "App/Components/AchievementIcon";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";

/** GRAPHQL **/
import QUERY_ICONS from "@eventyr/graphql/Queries/Icons";

interface Props extends AchievementIconProps {
  selected?: string;
  onChange(name: string): any;
}

interface ComposedProps extends Props {
  open: boolean;
  data: Query;
  setOpen?(open: boolean): any;
}

const IconPicker = ({
  open,
  data,
  onChange,
  setOpen,
  ...iconProps
}: ComposedProps) => (
  <React.Fragment>
    <TouchableOpacity onPress={() => setOpen && setOpen(!open)}>
      <AchievementIcon {...iconProps} name={iconProps.name || "flag-variant"} />
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
                data={data.icons ? data.icons : []}
                keyExtractor={item => item || "N/A"}
                renderItem={({ item }: { item: string }) =>
                  item ? (
                    <TouchableOpacity
                      onPress={() => {
                        onChange(item ? item : "flag-variant");
                        if (setOpen) {
                          setOpen(false);
                        }
                      }}
                      key={item}
                      style={{ margin: EStyleSheet.value("$spacing / 2") }}
                    >
                      <AchievementIcon {...iconProps} name={item} />
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

export default compose<ComposedProps, Props>(
  graphql(QUERY_ICONS),
  withState("open", "setOpen", false)
)(IconPicker);
