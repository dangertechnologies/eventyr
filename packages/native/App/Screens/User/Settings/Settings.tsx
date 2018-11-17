import React from "react";

/** COMPONENTS **/
import { TouchableOpacity, StyleSheet, View, Image } from "react-native";
import FastImage from "react-native-fast-image";
import Config from "../../../../app.json";

import { Text, Container, Content, Input, CheckBox, Icon } from "native-base";
import { ListItem, Divider } from "react-native-elements";
import ImagePicker, {
  Image as ImageType
} from "react-native-image-crop-picker";

/** UTILS */
import { compose, withProps, withState } from "recompose";
import { graphql, MutationFunc, MutationResult } from "react-apollo";
import { isEqual, pick, omit } from "lodash";

import MUTATE_UPDATE_USER, {
  updateQueries
} from "@eventyr/graphql/Mutations/Users/Update";

/** TYPES **/
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { User } from "@eventyr/graphql";
import { withUser, UserContext } from "@eventyr/core/Providers";

import EStyleSheet from "react-native-extended-stylesheet";

import RemoteImage from "App/Components/RemoteImage";
import { UIContext, withUIHelpers } from "App/Providers/UIProvider";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

interface ComposedProps extends Props {
  currentUser: UserContext;
  ui: UIContext;
  mutate: MutationFunc;
}

interface State extends Pick<User, "avatar" | "name" | "email" | "allowCoop"> {}

export const HeaderSaveButton = ({ navigation }: Props) =>
  navigation.getParam("onSave") ? (
    <TouchableOpacity onPress={navigation.getParam("onSave")}>
      <Text style={styles.saveButton}>Save</Text>
    </TouchableOpacity>
  ) : null;

class SettingsScreen extends React.Component<ComposedProps, State> {
  state: State = {
    name: "",
    email: "",
    avatar: "",
    allowCoop: true
  };

  static getDerivedStateFromProps(props: ComposedProps, state: State) {
    if (!state.name && !state.avatar && !state.email) {
      return pick(props.currentUser, ["avatar", "name", "email", "allowCoop"]);
    }
    return null;
  }

  public save = async () => {
    const avatar =
      this.state.avatar && this.state.avatar.indexOf(",") !== 1
        ? this.state.avatar.split(",")[1]
        : this.state.avatar;

    this.props
      .mutate({
        variables: {
          ...this.state,
          avatar:
            this.state.avatar === this.props.currentUser.avatar ? null : avatar
        },
        // @ts-ignore
        updateQueries,
        refetchQueries: ["UserCheck"]
      })
      .then((result: MutationResult) => {
        if (
          result.data &&
          result.data.updateMe &&
          result.data.updateMe.errors &&
          result.data.updateMe.errors.length
        ) {
          this.props.ui.notifyError(result.data.updateMe.errors[0]);
        } else {
          // Refresh the image cache
          if (
            result.data &&
            result.data.updateMe &&
            result.data.updateMe.user &&
            result.data.updateMe.user.avatar
          ) {
            FastImage.preload([
              {
                uri: __DEV__
                  ? `http://${Config.baseUrlDev}/${
                      result.data.updateMe.user.avatar
                    }`
                  : `https://${Config.baseUrl}${
                      result.data.updateMe.user.avatar
                    }`
              }
            ]);
          }

          this.props.navigation.setParams({
            onSave: null
          });
          this.props.ui.notifySuccess("Saved");
        }
      });
  };

  public componentDidUpdate() {
    const isUserModified = !isEqual(
      pick(this.props.currentUser, ["name", "email", "avatar", "allowCoop"]),
      this.state
    );

    if (isUserModified && !this.props.navigation.getParam("onSave")) {
      this.props.navigation.setParams({
        onSave: this.save
      });
    } else if (!isUserModified && this.props.navigation.getParam("onSave")) {
      this.props.navigation.setParams({
        onSave: null
      });
    }
  }

  private updateName = (text: string) => this.setState({ name: text });

  private updateEmail = (text: string) => this.setState({ email: text });

  private toggleAllowCoop = () =>
    this.setState({ allowCoop: !this.state.allowCoop });

  private pickImage = () =>
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      compressImageQuality: 0.6,
      compressImageMaxHeight: 400,
      compressImageMaxWidth: 400,

      includeBase64: true,
      cropping: true
    }).then(image => {
      const { data, mime } = image as ImageType;

      console.log({ image });
      this.setState({
        avatar: `data:${mime};base64,${data as string}`
      });
    });

  render() {
    console.log({ props: this.props });

    return (
      <Container style={{ flex: 1 }}>
        <Content style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.pickImage}>
              <View style={styles.avatarContainer}>
                {this.state.avatar && !this.state.avatar.startsWith("data") ? (
                  <RemoteImage
                    style={styles.avatar}
                    source={{ uri: this.state.avatar as string }}
                  />
                ) : (
                  <Image
                    style={styles.avatar}
                    resizeMode="cover"
                    source={{ uri: this.state.avatar as string }}
                  />
                )}
                <View style={styles.avatarOverlay}>
                  <Icon name="plus" style={styles.avatarAddIcon} />
                </View>
              </View>
            </TouchableOpacity>
            <Input
              value={this.state.name}
              onChangeText={this.updateName}
              style={styles.nameInput}
            />
          </View>

          <ListItem
            title="Email"
            contentContainerStyle={{
              flex: 2 / 3
            }}
            rightElement={
              <Input value={this.state.email} onChangeText={this.updateEmail} />
            }
            containerStyle={{ paddingBottom: 0 }}
          />
          <Text style={styles.subtitle} note>
            Your email lets other users add you as a friend
          </Text>
          <Divider />

          <ListItem
            title="Visible"
            rightElement={<CheckBox checked={this.state.allowCoop} />}
            containerStyle={styles.rightInputElementPadding}
            onPress={this.toggleAllowCoop}
          />
          <Text style={styles.subtitle} note>
            {`Other users may ${
              this.state.allowCoop ? "now" : "not"
            } request to cooperate with you`}
          </Text>
          <Divider />
        </Content>
      </Container>
    );
  }
}

const styles = EStyleSheet.create({
  transparent: { backgroundColor: "transparent" },

  subtitle: {
    paddingHorizontal: "$spacing",
    fontSize: "$sizeTiny",
    marginBottom: "$spacing / 2"
  },

  rightInputElementPadding: {
    paddingRight: "$spacingDouble"
  },

  saveButton: {
    color: "$colorSecondary",
    marginRight: "$spacingDouble"
  },

  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  header: {
    flex: 5 / 10,
    width: "100%",
    backgroundColor: "$colorPrimary",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "$borderColor",
    justifyContent: "flex-end",
    alignItems: "center"
  },

  formLabel: {
    flex: 4 / 10
  },

  formInput: {
    flex: 6 / 10
  },

  content: {
    flex: 1
  },

  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  avatarAddIcon: {
    fontSize: 30,
    color: "$colorSecondary"
  },

  avatarOverlay: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(200,200,200, 0.4)",
    alignItems: "center",
    justifyContent: "center"
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  nameInput: {
    color: "$colorSecondary",
    fontSize: "$sizeH3",
    borderBottomWidth: 1,
    borderBottomColor: "$colorSecondary",
    paddingBottom: 0,
    marginBottom: "$spacingDouble"
  }
});

const Enhanced = compose<ComposedProps, Props>(
  withUser,
  withUIHelpers,
  graphql(MUTATE_UPDATE_USER)
)(SettingsScreen);

// @ts-ignore
Enhanced.navigationOptions = SettingsScreen.navigationOptions;

export default Enhanced;
