import React from "react";
import { sortBy, flatten, omit } from "lodash";

// @ts-ignore
import haversine from "haversine-distance";
import { addSeconds, differenceInDays, differenceInSeconds } from "date-fns";
import {
  Unlocked,
  Objective,
  Query,
  CompleteObjectiveInput
} from "App/Types/GraphQL";
import withLocation, { LocationContext } from "./LocationProvider";
import { MutationFunc, graphql } from "react-apollo";
import { compose } from "recompose";

import { withUIHelpers, UIContext } from "./UIProvider";

import MUTATE_COMPLETE_OBJECTIVE, {
  updateQueries
} from "App/GraphQL/Mutations/Achievements/CompleteObjective";
import MUTATE_REFRESH_TRACKED, {
  updateQueries as updateTrackedAchievements
} from "App/GraphQL/Mutations/Achievements/RefreshTracked";
import QUERY_TRACKED from "App/GraphQL/Queries/Achievements/List";
import { RehydrationContext, withRehydratedState } from "./RehydrationProvider";

export interface UnlockContext {
  completeObjective(id: string): Promise<Array<Unlocked>>;
}

interface TrackedObjective {
  distance: number;
  nextCalculation: number;
  objective: Objective;
}
interface State {
  lastTrackRefresh: Date | null;
  lastTrackRefreshCoordinates: null | {
    latitude: number;
    longitude: number;
  };

  // Assigns every Objective a deadline for when
  // distance should be re-calculated. The shorter
  // the distance is to an objective, the shorter
  // the deadline will be. This allows us to avoid
  // unnecessary calculations for objectives that are
  // far away, and we can defer those until later,
  // while for objectives that are getting closer
  // and closer, we can check the distance more and
  // more often to trigger an unlock
  tracked: Array<TrackedObjective>;
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

class UnlockProvider extends React.Component<ComposedProps, State> {
  state: State = {
    tracked: [],
    lastTrackRefresh: null,
    lastTrackRefreshCoordinates: null
  };

  recalculate = () => {
    const { location } = this.props;
    this.setState(
      {
        tracked: this.state.tracked.map((tracked: TrackedObjective) => {
          if (tracked.nextCalculation < new Date().getTime()) {
            const distance = haversine(tracked.objective, location);

            // Attempt unlock
            if (distance < 30) {
              console.log({
                name: "UnlockProvider#attemptUnlock",
                distance,
                tracked
              });
              this.completeObjective(tracked.objective.id).then(
                (unlocked: Array<Unlocked>) => {
                  if (unlocked.length) {
                    this.props.ui.notifySuccess(unlocked[0].achievement.name);
                  }
                }
              );
            }

            return {
              objective: tracked.objective,
              distance,
              nextCalculation: addSeconds(
                new Date(),
                distance > 15 ? distance : 15
              ).getTime()
            };
          }
          return tracked;
        })
      },
      () => {
        const { tracked } = this.state;
        // Find shortest time and recalculate:
        if (tracked.length) {
          const { nextCalculation } = sortBy(tracked, "nextCalculation")[0];

          setTimeout(this.recalculate, nextCalculation - new Date().getTime());
        }
      }
    );
  };

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

  refreshTrackedAchievements = () =>
    this.props.location &&
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
      .then(
        (result: any) =>
          this.props.location &&
          this.setState({
            lastTrackRefresh: new Date(),
            lastTrackRefreshCoordinates: {
              latitude: this.props.location.latitude,
              longitude: this.props.location.longitude
            }
          })
      );

  // Sort objectives by distance
  componentWillReceiveProps({ location, data }: ComposedProps) {
    // Refresh tracked Achievement if they haven't been refreshed in
    // more than a day, or if distance since last refresh is more than
    // 10km
    if (this.state.lastTrackRefreshCoordinates && this.props.location) {
      const d = haversine(
        this.state.lastTrackRefreshCoordinates,
        this.props.location
      );
      console.log({ distance: d });
    }
    if (
      !this.state.lastTrackRefresh ||
      (this.state.lastTrackRefreshCoordinates &&
        haversine(this.state.lastTrackRefreshCoordinates, this.props.location) >
          10000) ||
      differenceInDays(this.state.lastTrackRefresh, new Date()) > 1
    ) {
      if (this.props.location && this.props.rehydratedState.isLoggedIn) {
        console.log({ name: "UnlockProvider#refreshTracked" });
        this.setState(
          {
            lastTrackRefresh: new Date()
          },
          this.refreshTrackedAchievements
        );
      }
    }

    if (
      location &&
      data &&
      data.achievements &&
      data.achievements.edges &&
      data.achievements.edges.length
    ) {
      const objectives: Array<Objective> = flatten(
        data.achievements.edges.map(({ node }) => (node ? node.objectives : []))
      );

      const tracked = sortBy(
        objectives.filter(node => node && node.lat && node.lng).map(
          (objective): TrackedObjective => {
            const distance = haversine(objective, location);
            return {
              objective,
              distance,
              nextCalculation: addSeconds(
                new Date(),
                distance > 15 ? distance : 15
              ).getTime()
            };
          }
        ),
        "distance"
      );

      // Find shortest time and recalculate:
      if (tracked.length) {
        const nearest = sortBy(tracked, "nextCalculation")[0];
        const { nextCalculation } = nearest;

        console.log({
          name: "UnlockProvider#recalculateTimer",
          value: { nearest }
        });

        setTimeout(this.recalculate, nextCalculation - new Date().getTime());
      }

      this.setState({
        tracked
      });
    }
  }

  render() {
    const contextValue = {
      completeObjective: this.completeObjective
    };

    console.log({
      name: "UnlockProvider#render",
      props: omit(this.props, ["children"])
    });

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
