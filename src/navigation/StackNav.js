import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ChatUserLists from "../screens/chats";
import ChatDashboard from "../screens/ChatDashboard";
import UserProfile from "../screens/UserProfile";
import SelectProfileScreen from "../screens/SelectProfile";
import ClubList from "../screens/ClubList";
import SettingsPage from "../screens/Settings";
import AllUserListScreen from "../screens/AllUsers";
import AllGroupsscreen from "../screens/AllGroups";
import GroupProfile from "../screens/GroupProfile";
import GroupChatDashboard from "../screens/GroupChatDashboard";
const Stack = createStackNavigator();

const StackNav = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ClubList" component={ClubList} />
            <Stack.Screen name="ChatUserLists" component={ChatUserLists} />
            <Stack.Screen name="ChatDashboard" component={ChatDashboard} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen
              name="SelectProfile"
              component={SelectProfileScreen}
            />
            <Stack.Screen name="SettingsPage" component={SettingsPage} />
            <Stack.Screen name="AllUserList" component={AllUserListScreen} />
            <Stack.Screen name="AllGroups" component={AllGroupsscreen} />
            <Stack.Screen name="GroupProfile" component={GroupProfile} />
            <Stack.Screen
              name="GroupChatDashboard"
              component={GroupChatDashboard}
            />

            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default StackNav