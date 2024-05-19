import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";

//screens
import PrevHomeScreen from "./screens/PrevHomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import TabNavigationHome from "./navigations/TabNavigationHome";
import CommentScreen from "./screens/CommentScreen";
import ReactionScreen from "./screens/ReactionScreen";
import SearchScreen from "./screens/SearchScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import ProfileScreen from "./screens/ProfileScreen";
//context
import {
  Provider as AuthProvider,
  Context as AuthContext,
} from "./context/AuthContext.js";

import { Provider as FriendProvider } from "./context/FriendContext.js";
import { useContext } from "react";

const Stack = createStackNavigator();

export default function Navigation() {
  const { state } = useContext(AuthContext);

  return (
    <FriendProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="PrevHome">
          {state.token != null ? (
            <>
              <Stack.Screen
                name="TabNavigationHome"
                component={TabNavigationHome}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={{
                  headerTitle: "Create post",
                  headerStyle: {
                    borderBottomColor: "#e2e4e7",
                    borderBottomWidth: 1,
                  },
                }}
              />

              <Stack.Group
                screenOptions={{
                  presentation: "modal",

                  // gestureDirection: 'vertical',
                }}
              >
                <Stack.Screen
                  name="Comment"
                  component={CommentScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Reaction"
                  component={ReactionScreen}
                  options={{
                    // gestureDirection: 'vertical',
                    title: "Reactions",
                    cardStyleInterpolator:
                      CardStyleInterpolators.forFadeFromCenter,
                  }}
                />
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{
                    headerTitleAlign: "center",
                    title: "Nguyễn Đông",
                  }}
                />
              </Stack.Group>
            </>
          ) : (
            <>
              <Stack.Screen
                name="PrevHome"
                component={PrevHomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </FriendProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});