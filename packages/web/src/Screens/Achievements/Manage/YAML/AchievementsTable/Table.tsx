import React from "react";
import { Achievement } from "@eventyr/graphql";
import { Table } from "@material-ui/core";
import TBody from "./Body";
import THead from "./Header";

interface Props {
  achievements: Array<Array<string | Achievement>>;
}

const AchievementTable = ({ achievements }: Props) => (
  <Table>
    <THead />
    <TBody achievements={achievements} />
  </Table>
);

export default AchievementTable;
