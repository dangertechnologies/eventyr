import gql from "graphql-tag";

import notification from "../../Fragments/Notification";

export const subscription = gql`
  subscription onNotificationReceived {
    notificationReceived {
      ...notification
    }
  }
  ${notification}
`;

export default gql`
  query UserNotifications {
    notifications {
      edges {
        node {
          ...notification
        }
      }
    }
  }
  ${notification}
`;
