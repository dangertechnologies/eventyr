import React from "react";
import Drawer, { Props as DrawerProps } from "App/Components/Drawer";
import { Achievement, List } from "App/Types/GraphQL";

import Form, { FormProps } from "./Form";

interface Props extends Partial<DrawerProps> {
  achievement?: Achievement;
  list?: List;
  onSend(model: FormProps["model"]): any;
  onCancel(): any;
}

const RequestDrawer = ({
  achievement,
  list,
  onSend,
  onCancel,
  ...rest
}: Props) => (
  <Drawer snapTo={[-1, "35%", "55%"]} initialSnapIndex={2} {...rest}>
    <Form onSend={onSend} onCancel={onCancel} />
  </Drawer>
);

export default RequestDrawer;
