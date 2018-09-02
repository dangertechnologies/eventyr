import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Map from "react-native-maps";
import { Objective } from "graphqlTypes";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import {
  Container,
  Form,
  Input,
  Textarea,
  Label,
  Item,
  CardItem,
  Body,
  Right,
  Left,
  Picker,
  H3,
  Text
} from "native-base";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { Achievement, Type, Mode, Category } from "../Types/graphqlTypes";
import AchievementIcon from "../Components/AchievementIcon";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface Props {}

interface State {
  achievement: Omit<
    Achievement,
    | "id"
    | "objectives"
    | "author"
    | "type"
    | "mode"
    | "category"
    | "hasParents"
    | "points"
  > & {
    objectives: Array<
      Objective & { color: string; lat?: number; lng?: number }
    >;
    type: Type | null;
    mode: Mode | null;
    category: Category | null;
  };

  expandedForm: boolean;
  coordinates: number[];
}

const getStyles = (expanded: boolean) =>
  EStyleSheet.create({
    formContainer: {
      height: expanded ? "60%" : "30%",
      width: "100%",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingTop: "$spacing",
      borderColor: "#CCCCCC",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderRightWidth: StyleSheet.hairlineWidth,
      backgroundColor: "$colorPrimary",
      position: "absolute",
      bottom: 0
    },

    actionButtonIcon: {
      fontSize: 22,
      color: "#FFFFFF"
    },

    expansionContainer: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      height: "$spacing"
    }
  });

class AchievementsCreate extends React.Component<Props, State> {
  static navigationOptions = {
    tabBarVisible: false,
    header: null
  };

  state: State = {
    achievement: {
      name: "",
      shortDescription: "",
      longDescription: "",
      icon: "binoculars",
      basePoints: 10,
      mode: null,
      category: null,
      type: null,
      objectives: [],
      expires: null,
      isMultiPlayer: false,
      isGlobal: false,
      requestReview: false
    },
    expandedForm: true,
    coordinates: []
  };

  render() {
    const styles = getStyles(this.state.expandedForm);
    return (
      <View style={{ flex: 1 }}>
        <Map style={StyleSheet.absoluteFill} />
        <Form style={styles.formContainer}>
          <View style={styles.expansionContainer}>
            <TouchableOpacity
              onPress={() =>
                this.setState({ expandedForm: !this.state.expandedForm })
              }
            >
              <Icon
                name={this.state.expandedForm ? "chevron-down" : "chevron-up"}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <Container>
            <CardItem>
              <Right style={{ flexGrow: 1, alignItems: "flex-end" }}>
                <Text note style={{ fontSize: 12 }}>
                  Normal
                </Text>
              </Right>
            </CardItem>
            <CardItem>
              <Left style={{ flexGrow: 1 }}>
                <AchievementIcon
                  name={"flag-variant"}
                  size={40}
                  difficulty={"Normal"}
                />
                <Body>
                  <Item>
                    <Input placeholder="Title" />
                  </Item>
                  <Item picker style={{ borderBottomWidth: 0 }}>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="chevron-down" color="#CCCCCC" />}
                      style={{ width: undefined }}
                      placeholder="Category"
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={0}
                      textStyle={{
                        fontSize: EStyleSheet.value("$sizeParagraph")
                      }}
                      onValueChange={value => console.log(value)}
                    >
                      <Picker.Item label="Food & Culinary" value="0" />
                      <Picker.Item label="Culture" value="1" />
                      <Picker.Item label="Nature & Wildlife" value="2" />
                    </Picker>
                  </Item>
                </Body>
              </Left>
              <Right style={{ flex: 0.3 }}>
                <H3>{100}</H3>
              </Right>
            </CardItem>

            <CardItem>
              <Body>
                <Item stackedLabel>
                  <Label>Description</Label>
                  <Textarea
                    rowSpan={5}
                    placeholder="Give other users a background story for your achievement"
                  />
                </Item>
              </Body>
            </CardItem>
          </Container>
        </Form>

        <ActionButton
          buttonColor={EStyleSheet.value("$green")}
          verticalOrientation="down"
        >
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Location"
            onPress={() => console.log("notes tapped!")}
          >
            <Icon name="flag-variant" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="Action"
            onPress={() => {}}
          >
            <Icon name="run" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

export default AchievementsCreate;
