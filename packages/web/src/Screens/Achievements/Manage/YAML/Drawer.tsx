import React from "react";
import {
  Dialog,
  Tabs,
  Tab,
  AppBar,
  Grid,
  Button,
  DialogActions,
  DialogContent,
  IconButton,
  Toolbar
} from "@material-ui/core";

import Slide, { SlideProps } from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import { compose, withStateHandlers } from "recompose";
import yaml from "js-yaml";
import { Achievement } from "@eventyr/graphql";
import Input from "./Input";
import Preview from "./Preview";

import { achievementsToYaml } from "./Converters";
import findState from "./Validation/determineChange";

interface DrawerProps {
  open: boolean;
  onClose(): any;
  existingAchievements: Achievement[];
}

type AvailableTabs = "preview" | "edit";

type State = {
  editedAchievements: Achievement[];
  tab: AvailableTabs;
};

interface InnerDrawerProps extends DrawerProps {
  setEditedAchievements(achievements: Achievement[]): any;
  setTab(tab: AvailableTabs): any;
}

const SlideUp = (props: SlideProps) => <Slide direction="up" {...props} />;

const Drawer = ({
  open,
  onClose,
  tab,
  setTab,
  existingAchievements,
  editedAchievements,
  setEditedAchievements
}: InnerDrawerProps & State) => (
  <>
    <Grid container>
      <Grid item xs={11}>
        <Tabs
          value={tab}
          onChange={(event: React.ChangeEvent<any>, value: AvailableTabs) =>
            setTab(value)
          }
        >
          <Tab value="edit" label="Edit" />
          <Tab value="preview" label="Preview" />
        </Tabs>
      </Grid>
      <Grid item xs={1} style={{ textAlign: "right" }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Grid>
    </Grid>

    <DialogContent>
      {tab === "edit" ? (
        <Input
          onParse={setEditedAchievements}
          initialText={yaml.dump(achievementsToYaml(existingAchievements))}
        />
      ) : (
        <Preview
          achievements={editedAchievements.map(achievement => [
            findState(achievement, existingAchievements),
            achievement
          ])}
        />
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button>Save</Button>
    </DialogActions>
  </>
);

export default compose<InnerDrawerProps & State, DrawerProps>(
  withStateHandlers<State, {}>(
    ({ existingAchievements }: any) => ({
      tab: "edit",
      editedAchievements: existingAchievements
    }),
    {
      setTab: () => (tab: AvailableTabs) => ({ tab }),
      setEditedAchievements: () => (editedAchievements: Achievement[]) => ({
        editedAchievements
      })
    }
  )
)(Drawer);
