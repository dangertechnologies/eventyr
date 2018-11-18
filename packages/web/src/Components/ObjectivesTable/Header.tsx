import React from "react";
import { TableHead, TableRow, TableCell } from "@material-ui/core";

const THead = () => (
  <TableHead>
    <TableRow>
      <TableCell variant="head">Tagline</TableCell>
      <TableCell variant="head">Kind</TableCell>
      <TableCell variant="head" numeric>
        Latitude
      </TableCell>
      <TableCell variant="head" numeric>
        Longitude
      </TableCell>
    </TableRow>
  </TableHead>
);

export default THead;
