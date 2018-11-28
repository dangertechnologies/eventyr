import React from "react";
import { compose } from "recompose";
import { Typography, Tabs, Tab, Theme, withStyles } from "@material-ui/core";
import OverScroll from "react-over-scroll";

import Wanderlust from "../../Images/wanderlust4.jpg";
import Mountain from "../../Images/wanderlust.jpg";
import Paris from "../../Images/paris3.jpg";
import Section from "./Section/Section";
import Content from "./Section/Content";

import Menu from "../../Navigation/TopBar";

interface ComposedProps {
  classes: { [key: string]: string };
}

class LandingPage extends React.PureComponent<ComposedProps> {
  render() {
    const { classes } = this.props;

    return (
      <Menu
        contentRight={
          <Tabs value="concept">
            <Tab value="concept" label="Concept" />
            <Tab value="development" label="Development" />
            <Tab value="contact" label="Contact" />
          </Tabs>
        }
      >
        <OverScroll slides={5} anchors="#section">
          {({ page, progress }) => {
            console.log({ page, progress });
            return (
              <div
                style={{
                  position: "absolute",
                  top: `${(page + progress) * -100}%`
                }}
              >
                <Section
                  backgroundImage={Wanderlust}
                  backgroundPosition="center"
                >
                  <Content
                    progress={page === 0 ? progress : 1}
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
                  >
                    {`
                    Life is the warm relations you create with other people,
                    and the memories you collect together.
                    `}
                  </Content>

                  <Content
                    reverse
                    title="Concept"
                    progress={page === 1 ? progress : 1}
                  >
                    {`
                    Eventyr is an attempt at combining our infinite appetite for distractions,
                    and channel it into an an appetite for life.

                    An appetite for collecting good memories, and creating warm relations.
                  `}
                  </Content>
                </Section>

                <Section backgroundImage={Paris} backgroundPosition="bottom">
                  <Content
                    title="Discover"
                    progress={page === 2 ? progress : 1}
                  >
                    {`
                    Let's say you travel to Paris:
                    Your phone is your minimap, and shows you all important Achievements nearby.

                    Anywhere you go, you'll unlock achievements by visiting places of interest:
                    Not by looking at your phone, but by looking at the world
                  `}
                  </Content>
                </Section>

                <Section backgroundImage={Mountain}>
                  <Content
                    reverse
                    title="Cooperate"
                    progress={page === 3 ? progress : 1}
                  >
                    {`
                    With Eventyr, you can team up with friends you haven't met yet,
                    to complete Achievements, experience the world, and collect
                    memories together.
                  `}
                  </Content>

                  <Content title="Connect" progress={page === 4 ? progress : 1}>
                    {`
                    Every person carries a perspective you haven't seen yet.
                  `}
                  </Content>
                </Section>
              </div>
            );
          }}
        </OverScroll>
      </Menu>
    );
  }
}

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
