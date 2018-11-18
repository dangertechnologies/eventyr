import React from "react";
import { TableHead, TableRow, TableCell } from "@material-ui/core";

const THead = () => (
  <TableHead>
    <TableRow>
      <TableCell style={{ width: 30 }} />
      <TableCell variant="head">Name</TableCell>
      <TableCell variant="head">Objectives</TableCell>
      <TableCell variant="head">Points</TableCell>
    </TableRow>
  </TableHead>
);

export default THead;
