import React from "react";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IconProps } from "react-native-vector-icons/Icon";
import LottieView from "lottie-react-native";
import EStyleSheet from "react-native-extended-stylesheet";

export interface Props extends IconProps {
  difficulty: string;

  // If the icon receives unlocked=true when
  // unlocked was previously false, an animation
  // will play (once)
  unlocked?: boolean;
}

export interface State {
  animating: boolean;
}

const styles = EStyleSheet.create({
  container: {
    $size: "$spacingDouble * 2",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "$size",
    height: "$size",
    borderRadius: "$size / 2"
  }
});

const difficultyGradient = (difficulty: string) => {
  switch ((difficulty || "").toLowerCase()) {
    case "easy":
      // return ["#3A1C71", "#00dbde"];
      return [
        EStyleSheet.value("$colorPrimaryLight"),
        EStyleSheet.value("$colorSuccess")
      ];
    case "difficult":
      // return ["#FC5C7D", "#6a82fb"];
      return [
        EStyleSheet.value("$colorPrimaryLight"),
        EStyleSheet.value("$colorAlert")
      ];
    case "normal":
    default:
      return [
        EStyleSheet.value("$colorPrimary"),
        EStyleSheet.value("$colorWarning")
      ];
    // return ["#3A1C71", "#7F00FF", "#E100FF"];
  }
};

class AchievementIcon extends React.Component<Props, State> {
  static defaultProps = {
    unlocked: false
  };

  state: State = {
    animating: false
  };

  animation: LottieView | null = null;

  componentWillReceiveProps(props: Props, nextState: State) {
    if (!this.props.unlocked && props.unlocked) {
      this.setState(
        { animating: true },
        () =>
          this.animation &&
          Promise.resolve(this.animation.play()).then(() =>
            setTimeout(() => this.setState({ animating: false }), 2000)
          )
      );
    }
  }

  render() {
    const { unlocked, difficulty, ...rest } = this.props;

    const goldGradient = [
      "#FEDB37",
      "#FDB931",
      "#9f7928",
      "#FDB931",
      "#FEDB37"
    ];

    return (
      <LinearGradient
        colors={!unlocked ? difficultyGradient(difficulty) : goldGradient}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        {this.state.animating ? (
          <LottieView
            ref={(animation: any) => {
              this.animation = animation;
            }}
            style={{ width: 100, height: 100 }}
            source={require("../Lottie/unlock.json")}
          />
        ) : (
          <Icon color={"#FFFFFF"} {...rest} />
        )}
      </LinearGradient>
    );
  }
}

export default AchievementIcon;
