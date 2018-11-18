import React from "react";
import {
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  LinearProgress,
  Paper,
  Toolbar,
  Chip,
  Typography
} from "@material-ui/core";
import { compose, withStateHandlers } from "recompose";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ChevronDown from "@material-ui/icons/ExpandMore";
import { Achievement } from "@eventyr/graphql";

import AchievementDetailsProvider from "../../DataProviders/AchievementDetailsProvider";

import ObjectivesTable from "../ObjectivesTable";

interface Props {
  achievements: Achievement[];
}

interface RowProps {
  achievement: Achievement;
}

interface RowPropsComposed extends RowProps {
  open: boolean;
  toggle(): any;
}

const TRow = ({ achievement, toggle, open }: RowPropsComposed) => (
  <>
    <TableRow>
      <TableCell style={{ width: 30 }}>
        <IconButton onClick={toggle}>
          {open ? <ChevronDown /> : <ChevronRight />}
        </IconButton>
      </TableCell>
      <TableCell variant="body">{achievement.name}</TableCell>
      <TableCell>
        {achievement.objectives.map(objective => (
          <Chip label={objective.tagline} />
        ))}
      </TableCell>
      <TableCell variant="body">{achievement.points}</TableCell>
    </TableRow>
    {!open ? null : (
      <AchievementDetailsProvider id={achievement.id}>
        {({ data, loading }) =>
          loading ? (
            <LinearProgress />
          ) : (
            <TableRow>
              <TableCell />
              <TableCell colSpan={3}>
                <Paper style={{ padding: 20 }}>
                  <Typography variant="subtitle1">Details</Typography>
                  <Typography variant="body1">
                    {data && data.shortDescription}
                  </Typography>
                </Paper>
                <Paper>
                  <ObjectivesTable objectives={data ? data.objectives : []} />
                </Paper>
              </TableCell>
            </TableRow>
          )
        }
      </AchievementDetailsProvider>
    )}
  </>
);

const AchievementRow = compose<RowPropsComposed, RowProps>(
  withStateHandlers(
    {
      open: false
    },
    {
      toggle: ({ open }) => () => ({ open: !open })
    }
  )
)(TRow);

const TBody = ({ achievements }: Props) => (
  <TableBody>
    {achievements.map(achievement => (
      <AchievementRow achievement={achievement} />
    ))}
  </TableBody>
);

export default TBody;
