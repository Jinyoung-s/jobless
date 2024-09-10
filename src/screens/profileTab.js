import * as React from "react";
import { Text, View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { primaryColor } from "../styles/styles";

const WorksRoute = () => (
  <View>
    <Text>This is Works</Text>
  </View>
);

const ServicesRoute = () => (
  <View>
    <Text>This is Services</Text>
  </View>
);
const ReviewsRoute = () => (
  <View>
    <Text>This is Review</Text>
  </View>
);

const renderScene = SceneMap({
  works: WorksRoute,
  services: ServicesRoute,
  reviews: ReviewsRoute,
});

export default function ProfileTab() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "works", title: "Works" },
    { key: "services", title: "Services" },
    { key: "reviews", title: "Reviews" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: primaryColor }}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
    />
  );
}
