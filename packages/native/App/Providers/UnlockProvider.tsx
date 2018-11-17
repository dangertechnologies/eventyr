import React from "react";
import { flatten, omit } from "lodash";

// @ts-ignore
import haversine from "haversine-distance";
import { differenceInDays } from "date-fns";
import {
  Unlocked,
  Objective,
  Query,
  CompleteObjectiveInput
} from "@eventyr/graphql";
import withLocation, { LocationContext } from "./LocationProvider";
import { MutationFunc, graphql } from "react-apollo";
import { compose } from "recompose";

import { withUIHelpers, UIContext } from "./UIProvider";

import MUTATE_COMPLETE_OBJECTIVE, {
  updateQueries
} from "@eventyr/graphql/Mutations/Achievements/CompleteObjective";
import MUTATE_REFRESH_TRACKED, {
  updateQueries as updateTrackedAchievements
} from "@eventyr/graphql/Mutations/Achievements/RefreshTracked";
import QUERY_TRACKED from "@eventyr/graphql/Queries/Achievements/List";
import {
  RehydrationContext,
  withRehydratedState
} from "@eventyr/core/Providers/RehydratedState";
import { isEqual } from "apollo-utilities";

export interface UnlockContext {
  completeObjective(id: string): Promise<Array<Unlocked>>;
}

interface State {
  lastTrackRefresh: Date | null;
  lastTrackRefreshCoordinates: null | {
    latitude: number;
    longitude: number;
  };
  refreshing: boolean;
  objectives: Objective[];
}

interface Props {
  children: React.ReactNode;
}

type ComposedProps = Props & {
  refreshTracked: MutationFunc;
  completeObjective: MutationFunc;
  rehydratedState: RehydrationContext;
  location: LocationContext;
  ui: UIContext;
  data: Query;
};

const DEFAULT_CONTEXT: UnlockContext = {
  completeObjective: id => Promise.reject()
};

const { Provider, Consumer } = React.createContext(DEFAULT_CONTEXT);

/**
 * UnlockProvider makes use of LocationProvider to attempt to track the
 * user as he/she moves around in the world.
 *
 * This is a much more simplified version of the old one, that only
 * does:
 * 1. Extract all objectives to state
 * 2. When location changes, check if any objectives in state is within 30m, and attempt unlock
 * 3. If its been more than a day, or 10km, since we last updated TrackedAchievements, then refresh
 * 4. If we're already refreshing, dont try to refresh again
 *
 * @class UnlockProvider
 * @extends {React.Component<ComposedProps, State>}
 */
class UnlockProvider extends React.Component<ComposedProps, State> {
  state: State = {
    lastTrackRefresh: null,
    lastTrackRefreshCoordinates: null,
    refreshing: false,
    objectives: []
  };

  recalculationTimer: ReturnType<typeof setTimeout> | null = null;

  static getDerivedStateFromProps(props: ComposedProps, state: State) {
    if (
      props.data.achievements &&
      props.data.achievements.edges &&
      props.data.achievements.edges.length
    ) {
      return {
        objectives: flatten(
          props.data.achievements.edges.map(
            ({ node }) => (node && node.objectives) || []
          )
        )
      };
    }
    return null;
  }

  /**
   * If location has changed, we check if we can unlock any tracked
   * achievements.
   *
   * If location remains the same, we do nothing, but we trigger a
   * refresh of tracked achievements if we've never fetched any before,
   * if it's more than a day ago, or if we were more than 5 km away
   * when we did
   */
  componentDidUpdate(oldProps: ComposedProps) {
    const isUpdatedEver = Boolean(this.state.lastTrackRefresh);
    const isUpdatedLast24H = Boolean(
      this.state.lastTrackRefresh &&
        differenceInDays(new Date(), this.state.lastTrackRefresh) < 1
    );
    const isUpdatedWithin10km = Boolean(
      this.state.lastTrackRefreshCoordinates &&
        haversine(this.state.lastTrackRefreshCoordinates, this.props.location) <
          10000
    );

    const isPreparedToUpdate = Boolean(
      this.props.location &&
        this.props.rehydratedState.isLoggedIn &&
        !this.state.refreshing
    );

    if (
      (!isUpdatedEver || !isUpdatedLast24H || !isUpdatedWithin10km) &&
      isPreparedToUpdate
    ) {
      console.log({
        name: "UnlockProvider#refreshTracked",
        isUpdatedEver,
        isUpdatedLast24H,
        isUpdatedWithin10km,
        lastTrackRefresh: this.state.lastTrackRefresh
      });

      this.setState({ refreshing: true }, this.refreshTrackedAchievements);
    }

    // Check if any objective is within 30 meters radius and attempt to unlock it
    if (
      this.state.objectives &&
      this.state.objectives.length &&
      !isEqual(oldProps.location, this.props.location)
    ) {
      this.state.objectives.forEach((objective: Objective) => {
        const distance = haversine(objective, this.props.location);

        // Attempt unlock
        if (distance < 30) {
          console.log({
            name: "UnlockProvider#attemptUnlock",
            distance,
            objective
          });
          this.completeObjective(objective.id).then(
            (unlocked: Array<Unlocked>) => {
              if (unlocked.length) {
                this.props.ui.notifySuccess(unlocked[0].achievement.name);
              }
            }
          );
        }
      });
    }
  }

  /**
   * In theory, this component should never need to
   * re-render, because we dont provide anything from
   * state down to the children.
   *
   * Since the value of the context is only a references
   * to this.completeObjective, re-rendering is a waste,
   * and we can skip that altogether.
   *
   * NOTE: Remove this if anything else is added to state.
   * @param {ComposedProps} props
   * @param {State} state
   * @memberof UnlockProvider
   */
  shouldComponentUpdate(props: ComposedProps) {
    return !isEqual(props.location, this.props.location);
  }

  /**
   * Fetch Tracked (Suggested) Achievements from the server,
   * and remember when these were fetched and what coordinates
   * were used for fetching.
   * When distance changes by more than 10km from the last fetch,
   * or it's been more than 24 hours since these were updated,
   * request new tracked Acheivements.
   *
   * Tracked Achievements are used for *automatically* unlocking
   * objectives as the user moves around. The closer a user is
   * to an objective, the more frequently this provider will try
   * to unlock that objective automatically. When the user is within
   * 30 meters of the objective, we check the users location once
   * every 15 seconds to try to unlock it.
   *
   * @todo Cache this data with RehydrationProvider
   */
  refreshTrackedAchievements = () => {
    if (this.props.location) {
      console.log({ name: "Unlock#refreshTracked", value: "request" });
      this.props
        .refreshTracked({
          variables: {
            coordinates: [
              this.props.location.latitude,
              this.props.location.longitude
            ]
          },
          // @ts-ignore
          updateQueries: updateTrackedAchievements
        })
        .then((result: any) => {
          if (this.props.location) {
            this.setState({
              lastTrackRefresh: new Date(),
              refreshing: false,
              lastTrackRefreshCoordinates: {
                latitude: this.props.location.latitude,
                longitude: this.props.location.longitude
              }
            });
          } else {
            console.log({
              name: "Unlock#error",
              value: omit(this.props, ["children"])
            });
          }
        });
    } else {
      console.log({ name: "Unlock#refreshTracked", value: "failed" });
    }
  };

  /**
   * Attempts to complete an objective by ID. This presumes
   * coordinates are available. Remember to catch any errors
   * from this promise.
   */
  completeObjective = (id: string): Promise<Array<Unlocked>> => {
    return new Promise((resolve, reject) => {
      if (!this.props.location) {
        console.log({
          name: "UnlockProvider#locationUnavailable",
          location: this.props.location
        });
        return reject(["Location unavailable"]);
      }

      const input: Omit<CompleteObjectiveInput, "clientMutationId"> = {
        id,
        coordinates: [
          this.props.location.latitude,
          this.props.location.longitude
        ],
        timestamp: new Date().getTime() / 1000
      };

      this.props
        .completeObjective({
          variables: input,
          // @ts-ignore
          updateQueries
        })
        .then((result: any) => {
          const { data } = result;

          if (data && data.errors && data.errors.length) {
            console.log({
              name: "UnlockProvider#failedMutation",
              data,
              result
            });
            reject(result.errors);
          } else if (
            data &&
            data.completeObjective &&
            data.completeObjective.errors &&
            data.completeObjective.errors.length
          ) {
            console.log({
              name: "UnlockProvider#failedMutation",
              data,
              result
            });
            reject(data.completeObjective.errors);
          } else {
            const { unlockedAchievements } = data.completeObjective;

            if (unlockedAchievements && unlockedAchievements.length) {
              let message = `${unlockedAchievements[0].achievement.name}`;
              if (unlockedAchievements.length > 1) {
                message = `${message} (+${unlockedAchievements.length -
                  1} more)`;
              }
              this.props.ui.localPushNotification({
                title: "Achievement Unlocked",
                message
              });

              // Remove the objective from state, so as to prevent
              // us from recalculating every 15 seconds for a completed
              // objective
              this.setState({
                objectives: this.state.objectives.filter(
                  objective => objective.id !== id
                )
              });
            }
            this.refreshTrackedAchievements();
            resolve(data.completeObjective.unlockedAchievements);
          }
        })
        .catch((errors: any) => {
          console.log({ name: "UnlockProvider#failedMutation", errors });
          reject(errors);
        });
    });
  };

  render() {
    const contextValue = {
      completeObjective: this.completeObjective
    };

    return <Provider value={contextValue}>{this.props.children}</Provider>;
  }
}

export const withUnlockHelpers = <P extends object>(
  Component: React.ComponentType<P & { unlockHelpers: UnlockContext }>
) =>
  class UnlockConsumer extends React.PureComponent<P> {
    render() {
      const props = this.props || {};
      return (
        <Consumer>
          {context => <Component {...props} unlockHelpers={context} />}
        </Consumer>
      );
    }
  };

export default {
  Consumer,
  Provider: compose<ComposedProps, Props>(
    graphql(MUTATE_COMPLETE_OBJECTIVE, { name: "completeObjective" }),
    graphql(MUTATE_REFRESH_TRACKED, { name: "refreshTracked" }),
    graphql(QUERY_TRACKED, { options: { variables: { type: "suggested" } } }),
    withRehydratedState,
    withUIHelpers,
    withLocation({ watch: true })
  )(UnlockProvider)
};
