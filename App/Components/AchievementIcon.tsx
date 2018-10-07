import React from "react";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IconProps } from "react-native-vector-icons/Icon";
import LottieView from "lottie-react-native";
import EStyleSheet from "react-native-extended-stylesheet";

export interface Props extends IconProps {
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
    $size: "$spacingDouble",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "$size",
    height: "$size",
    borderRadius: "$size / 2"
  }
});

/**
 * AchievementIcon displays the icon for the Achievement,
 * unless the Achievement *just* became Unlocked.
 * If unlocked={true}, while it was previously false,
 * the icon will be replaced by an animation that runs once,
 * before it's set back to display the icon again.
 *
 * This is so that we can display the AchievementIcon in cards
 * or drawers, and animate the icon as soon as the achievement
 * is actually unlocked.
 *
 * If unlocked={true}, the icon will have a gold background.
 */
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
    const { unlocked, ...rest } = this.props;

    const goldGradient = [
      "#FEDB37",
      "#FDB931",
      "#9f7928",
      "#FDB931",
      "#FEDB37"
    ];

    return (
      <LinearGradient
        colors={
          !unlocked
            ? [
                EStyleSheet.value("$colorSecondary"),
                EStyleSheet.value("$colorSecondary")
              ]
            : goldGradient
        }
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
          <Icon color={"#112F41"} {...rest} />
        )}
      </LinearGradient>
    );
  }
}

export default AchievementIcon;
