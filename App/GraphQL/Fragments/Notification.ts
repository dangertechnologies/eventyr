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
        achievement {
          id
          name
          points
        }
      }
    }
  }
`;
