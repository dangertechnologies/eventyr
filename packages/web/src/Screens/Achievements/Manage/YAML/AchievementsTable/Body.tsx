import React from "react";
import {
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  LinearProgress,
  Paper,
  Chip,
  Typography
} from "@material-ui/core";
import { compose, withStateHandlers } from "recompose";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ChevronDown from "@material-ui/icons/ExpandMore";
import { Achievement } from "@eventyr/graphql";

interface Props {
  achievements: Array<Array<string | Achievement>>;
}

interface RowProps {
  achievement: Achievement;
  state: string;
}

const TRow = ({ achievement, state }: RowProps) => (
  <>
    <TableRow>
      <TableCell style={{ width: 30 }}>{state}</TableCell>
      <TableCell variant="body">{achievement.name}</TableCell>
      <TableCell>
        {achievement.objectives.map(objective => (
          <Chip label={objective.tagline} />
        ))}
      </TableCell>
      <TableCell variant="body">{achievement.points}</TableCell>
    </TableRow>
  </>
);

const TBody = ({ achievements }: Props) => (
  <TableBody>
    {achievements.map(achievement => (
      <TRow
        achievement={achievement[1] as Achievement}
        state={achievement[0] as string}
      />
    ))}
  </TableBody>
);

export default TBody;
