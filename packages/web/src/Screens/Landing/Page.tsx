import React from "react";
import { compose } from "recompose";
import {
  Typography,
  Toolbar,
  Tabs,
  Tab,
  Theme,
  Grid,
  withStyles
} from "@material-ui/core";
import Wanderlust from "../../Images/wanderlust4.jpg";
import Mountain from "../../Images/wanderlust.jpg";
import Paris from "../../Images/paris3.jpg";
import Section from "./Section/Section";
import Content from "./Section/Content";

import Menu from "../../Navigation/TopBar";

interface ComposedProps {
  classes: { [key: string]: string };
}

const LandingPage = ({ classes }: ComposedProps) => (
  <Menu
    contentRight={
      <Toolbar>
        <Tabs value="concept">
          <Tab value="concept" label="Concept" />
          <Tab value="development" label="Development" />
          <Tab value="contact" label="Contact" />
        </Tabs>
      </Toolbar>
    }
  >
    <Section backgroundImage={Wanderlust} backgroundPosition="center">
      <Content
        title={
          <Typography
            variant="body1"
            color="textSecondary"
            style={{
              fontFamily: "Italianno",
              fontSize: "7rem",
              transform: "rotate(-7deg) translateY(-3rem)",
              textShadow: "1px 1px 5px #000000"
            }}
          >
            Eventyr
          </Typography>
        }
      >{`
        Life is the warm relations you create with other people,
        and the memories you collect together.
      `}</Content>

      <Content reverse title="Concept">
        {`
        Eventyr is an attempt at combining our infinite appetite for distractions,
        and channel it into an an appetite for life.

        An appetite for collecting good memories, and creating warm relations.
      `}
      </Content>
    </Section>

    <Section backgroundImage={Paris} backgroundPosition="bottom">
      <Content title="Discover">
        {`
        Let's say you travel to Paris:
        Your phone is your minimap, and shows you all important Achievements nearby.
      `}
      </Content>
    </Section>

    <Section backgroundImage={Mountain}>
      <Content reverse title="Cooperate">
        {`
        With Eventyr, you can team up with friends you haven't met yet,
        to complete Achievements, experience the world, and collect
        memories together.
      `}
      </Content>

      <Content title="Connect">
        {`
         Every person carries a perspective you haven't seen yet.
      `}
      </Content>
    </Section>
  </Menu>
);

const styles = (theme: Theme) => ({
  header: {
    minHeight: 200,
    backgroundColor: theme.palette.primary.dark
  },

  indicator: {
    color: theme.palette.primary.contrastText
  }
});

export default compose<ComposedProps, {}>(withStyles(styles))(LandingPage);
