import React from "react";
import { sortBy, flatten, omit } from "lodash";

// @ts-ignore
import haversine from "haversine-distance";
import { addSeconds, differenceInDays } from "date-fns";
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

/**
 * UnlockProvider makes use of LocationProvider to attempt to track the
 * user as he/she moves around in the world. We estimate that it takes
 * 1 second to walk 1 meter, so after fetching all Tracked Achievements,
 * which are the Achievements within a < 10km radius of the user, we
 * assign a distance value retrieved from calculating the haversine
 * distance between the Objective's coordinates and the users position
 * at the time, then find the lowest distance value (e.g the closest Objective),
 * to set a METERS * 1000ms Timeout, at which point we'll recalculate the
 * distance to any and all Objectives with a "nextCalculation" in the past.
 * This goes on and on, until an Objective is within range (30 meters), at
 * which point we'll try to complete it.
 *
 * When an Objective is completed, it may or may not unlock one or more
 * Achievements, returned from the mutation. These will be shown to the user
 * as a local push notification if any are returned, and the Tracked Achievements
 * will be refetched.
 *
 * This process continues in the background at all times.
 *
 * An alternative way of doing this would be to provide a listener, where
 * all Tracked Objectives register to listen for when the user is near
 * those coordinates, and could be done like:
 * - UnlockContext.addListener(59.8488, 10.49493, () => UnlockContext.completeObjective(objective.id))
 *
 * The reason I've chosen not to do this is because it would require us
 * to check the location at a set interval, e.g every 10 seconds, or less often,
 * whereas with this solution we can check more and more often the closer a
 * user gets, and less and less often the further away a user gets, to save
 * battery usage.
 *
 * Another reason is because we would need a way to "deregister" all previously
 * registered objectives once new Tracked Achievements are fetched, and keep
 * track of which objectives exist and which ones have been removed.
 * We need a way to dynamically do the fetching, and tracking, of location and
 * nearby Achievements in the background - but this may be a viable alternative
 * in the future, since it's a much simpler, and much cleaner solution.
 *
 * @class UnlockProvider
 * @extends {React.Component<ComposedProps, State>}
 */
class UnlockProvider extends React.Component<ComposedProps, State> {
  state: State = {
    tracked: [],
    lastTrackRefresh: null,
    lastTrackRefreshCoordinates: null
  };

  /**
   * When new props are received, we parse the TrackedAchievements
   * into an array of Objectives with some metadata, like distance,
   * and deadline for the next check of that objective.
   * We also need to add a timestamp of when we did this last refresh
   * of TrackedAchievements, to avoid spamming the server with requests
   * on every prop update, and so we only make a new request if
   * the user has moved more than 10km since last time, or we have no
   * previous data.
   *
   * TODO: This check is useless unless we actually cache that data with
   * AsyncStorage / RehydrationProvider, otherwise we'll end up making
   * requests all the time, if the app has been in the closed, or in the
   * background. State is not persisted when app is reloaded.
   *
   * @param {ComposedProps} { location, data }
   * @memberof UnlockProvider
   */
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
  shouldComponentUpdate() {
    return false;
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

  /**
   * Go through this.state.tracked and recalculate the distance
   * to every Objective which has a nextCalculation time in the
   * past. If the objective is within 30 meters, we'll immediately
   * try to unlock it, and display a notification.
   *
   * We attempt to unlock Objectives that are within 30 meters
   * every 15 seconds.
   *
   * @memberof UnlockProvider
   */
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
                tracked: this.state.tracked.filter(
                  ({ objective }) => objective.id !== id
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
