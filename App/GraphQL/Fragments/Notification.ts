import achievement from "./Achievement";

export default `
  fragment notification on Notification {
    id
    sender {
      id
      name
      avatar
    }

    kind
    targetType
    target {
      ...on CoopRequest {
        id
        isPending
        isComplete
        isAccepted
        message
        sender {
          id
          name
        }
        receiver {
          id
          name
        }
        achievement {
          id
          name
          points
        }
      }

      ...on FriendRequest {
        id
        message
        isAccepted
        createdAt
        sender {
          id
          name
        }
        receiver {
          id
          name
        }
      }

      ...on SharedAchievement {
        id
        createdAt
        sender {
          id
          name
        }
        receiver {
          id
          name
        }
        achievement {
          id
          name
          points
          inLists {
            id
            title
          }
        }
      }

      ...on SharedList {
        id
        sender {
          id
          name
        }
        receiver {
          id
          name
        }
        list {
          id
          title
          achievementsCount
          isFollowed
          author {
            id
            name
          }
        }
      }

      ...on Unlocked {
        id
        points
        coop
        coopBonus
        achievement {
          ...achievement
        }
      }
    }
  }
  ${achievement}
`;
