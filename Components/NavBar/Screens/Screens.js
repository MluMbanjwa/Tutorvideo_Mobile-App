import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TopicList from "../../Topic/TopicList/TopicList";
import SubTopiclist from "../../SubTopic/SubTopicList/SubTopicList";
import WatchTopic from "../../Video/Video";
import Login from "../../Forms/LogIn/Login";
import SignUp from "../../Forms/SignUp/Signup";
import Home from "../../Home/Home";
import UserProfile from "../../User/UserProfile";
import Test from "../../Activity/Test";
import YearReport from "../../Reports/YearReport/YearReport";
import TermReport from "../../Reports/TermReport/TermReport";
import TopicReport from "../../Reports/TopicReport/TopicReport";
import updateUser from "../../Forms/UpdateUser/UpdateUser";
import ChangePassword from "../../Forms/ChangePassword/ChangePassword";
import { View, StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

const Screens = () => {
  return (
    <View style={styles.container}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animation: "slide_from_right",
          headerShown: false,
        }}
      >
        <Stack.Screen name="Topics" component={TopicList} />
        <Stack.Screen name="SignIn" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Subtopics" component={SubTopiclist} />
        <Stack.Screen name="WatchTopic" component={WatchTopic} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={UserProfile} />
        <Stack.Screen name="Test" component={Test} />
        <Stack.Screen name="YearReport" component={YearReport} />
        <Stack.Screen name="TermReport" component={TermReport} />
        <Stack.Screen name="TopicReport" component={TopicReport} />
        <Stack.Screen name="UpdateUser" component={updateUser} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Screens;