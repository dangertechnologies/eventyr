import React from "react";
import { Objective } from "@eventyr/graphql";
import { Table, Toolbar, Typography } from "@material-ui/core";
import TBody from "./Body";
import THead from "./Header";

interface Props {
  objectives: Objective[];
}

const AchievementTable = ({ objectives }: Props) => (
  <>
    <Table>
      <THead />
      <TBody objectives={objectives} />
    </Table>
  </>
);

export default AchievementTable;
