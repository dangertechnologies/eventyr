import React from "react";
import Drawer, { Props as DrawerProps } from "App/Components/Drawer";
import { Achievement } from "@eventyr/graphql";

import Form, { FormProps } from "./Form";

interface Props extends Partial<DrawerProps> {
  achievement: Achievement;
  onSend(model: FormProps["model"]): any;
  onCancel(): any;
}

const RequestDrawer = ({ achievement, onSend, onCancel, ...rest }: Props) => (
  <Drawer snapTo={[-1, "35%", "55%"]} initialSnapIndex={2} {...rest}>
    <Form achievement={achievement} onSend={onSend} onCancel={onCancel} />
  </Drawer>
);

export default RequestDrawer;
