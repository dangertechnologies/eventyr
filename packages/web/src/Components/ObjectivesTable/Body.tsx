import React from "react";
import { TableRow, TableCell, TableBody } from "@material-ui/core";
import { Objective } from "@eventyr/graphql";

interface Props {
  objectives: Objective[];
}

const TBody = ({ objectives }: Props) => (
  <TableBody>
    {objectives.map(objective => (
      <TableRow>
        <TableCell variant="body">{objective.tagline}</TableCell>
        <TableCell variant="body">{objective.kind}</TableCell>
        <TableCell variant="body" numeric>
          {objective.lat}
        </TableCell>
        <TableCell variant="body" numeric>
          {objective.lng}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);

export default TBody;
