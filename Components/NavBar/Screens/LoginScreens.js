import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../Forms/LogIn/Login";
import SignUp from "../../Forms/SignUp/Signup";
const Stack = createNativeStackNavigator();

const LoginScreens = () => {

  return (
    <Stack.Navigator initialRouteName="SignUp" screenOptions={
    {
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        animation: "slide_from_right",
        headerShown:false,
      }
    }>
      <Stack.Screen name="SignIn" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default LoginScreens;