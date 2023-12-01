import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BottomNavBar from "../navigation/BottomNavBar";
import { memoizedSelectUserData, memoizedConversations } from "../selectors";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { fetchConversationsList } from "../reducers/conversationSlice";
import GroupImg from "../assets/group_icons.png";
import userPlaceholder from "../assets/user1.png";
import profileManager from "../assets/pm.png";

const Tab = createMaterialTopTabNavigator();

const UsersListScreen = ({
  chatUsers,
  handleUserClick,
  renderStatusIndicator,
  userID,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={chatUsers}
        renderItem={({ item }) =>
          item?.participants.map((participant, i) =>
            participant?.user_id != userID ? (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => handleUserClick(item, userID)}
                key={participant?.user_id}
              >
                <View style={styles.statusContainer}>
                  {participant?.user_photo ? (
                    <Image
                      source={{ uri: participant?.user_photo }}
                      style={styles.userImage}
                    />
                  ) : (
                    <Image source={userPlaceholder} style={styles.userImage} />
                  )}
                  {renderStatusIndicator(participant?.status)}
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {participant?.first_name} {participant?.last_name}{" "}
                    {participant?.profile_manager ? (
                      <Image source={profileManager} style={styles.pmImg} />
                    ) : null}
                  </Text>
                  {participant?.lastMessage ? (
                    <Text style={styles.lastMessage}>
                      {participant?.lastMessage}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.messageDetails}>
                  {item?.unread_count ? (
                    <View style={styles.messageCountContainer}>
                      <Text style={styles.messageCount}>
                        {item?.unread_count}
                      </Text>
                    </View>
                  ) : null}
                  <Text style={styles.lastMessageTime}>
                    {item?.lastMessageTime}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null
          )
        }
        keyExtractor={(item) => item?.id}
      />
    </View>
  );
};

const GroupsListScreen = ({ chatGroups, handleUserClick, userID }) => {
  const navigation = useNavigation();
  const goToGroupss = () => {
    navigation.navigate("GroupChatDashboard");
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={chatGroups}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() => handleUserClick(item, userID)}
          >
            <Image source={GroupImg} style={styles.groupImage} />
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{item.conversation_name}</Text>
              <Text style={styles.groupMembers}>
                {item?.participants?.length} members
              </Text>
            </View>
            <View style={styles.messageDetails}>
              {item?.unread_count ? (
                <View style={styles.messageCountContainer}>
                  <Text style={styles.messageCount}>{item?.unread_count}</Text>
                </View>
              ) : null}
              <Text style={styles.lastMessageTime}>
                {item?.lastMessageTime}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const ChatUserLists = ({ route, navigation }) => {
  const club = route.params.club;
  const userData = useSelector(memoizedSelectUserData);
  const Conversations = useSelector(memoizedConversations);
  const loading = useSelector((state) => state.conversations.loading);
  const error = useSelector((state) => state.conversations.error);

  const [chatUsers, setChatUsers] = useState([]);
  const [toggleState, setToggleState] = useState(true);
  const [AsUser, setAsUser] = useState(userData?.user_id);
  const [chatGroups, setChatGroups] = useState([]);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          if (toggleState) {
            UserID = userData?.user_id;
          } else {
            UserID = club?.post_id;
          }
          if (UserID) {
            dispatch(fetchConversationsList(UserID, club?.post_id));
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, [toggleState])
  );

  useEffect(() => {
    setChatUsers(Conversations?.user_conversations);
    setChatGroups(Conversations?.group_conversations);
  }, [Conversations, loading, error]);

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#0F0";
      case "offline":
        return "#F00";
      case "away":
        return "gray";
      default:
        return "#777";
    }
  };

  const renderStatusIndicator = (status) => (
    <View
      style={[
        styles.statusIndicator,
        { backgroundColor: getStatusColor(status) },
      ]}
    />
  );

  const handleUserClick = (conversation, AsUser) => {
    navigation.navigate("ChatDashboard", { conversation, AsUser, toggleState });
  };

  const toggleShuffle = () => {
    const newUserId = toggleState ? club?.post_id : userData?.user_id;
    setAsUser(newUserId);
    setToggleState(!toggleState);
  };

  const renderToggleText = () => {
    return toggleState ? "As Club" : "As User";
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>
            Hello{" "}
            {toggleState
              ? userData?.first_name + " " + userData?.last_name
              : club?.post_title}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleShuffle}>
            <FontAwesome
              name={!toggleState ? "toggle-on" : "toggle-off"}
              size={32}
              color="#000"
            />
            <Text style={styles.toggleText}>{renderToggleText()}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <View style={styles.containerLoader}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 15, fontWeight: 600 },
            tabBarStyle: {},
          }}
        >
          <Tab.Screen name="Direct Chat" options={{ title: "Direct Chat" }}>
            {() =>
              chatUsers?.length > 0 ? (
                <UsersListScreen
                  chatUsers={chatUsers}
                  handleUserClick={handleUserClick}
                  renderStatusIndicator={renderStatusIndicator}
                  userID={AsUser}
                />
              ) : (
                <Text style={styles.notFound}>No direct chats found.</Text>
              )
            }
          </Tab.Screen>
          <Tab.Screen name="Group Chat" options={{ title: "Groups Chat" }}>
            {() =>
              chatGroups?.length > 0 ? (
                <GroupsListScreen
                  chatGroups={chatGroups}
                  handleUserClick={handleUserClick}
                  userID={AsUser}
                />
              ) : (
                <Text style={styles.notFound}>No group chats found.</Text>
              )
            }
          </Tab.Screen>
        </Tab.Navigator>
      )}
      <BottomNavBar toggleState={toggleState} club={club} AsUser={AsUser} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  notFound: {
    textAlign: "center",
    fontSize: 20,
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
  },
  img_top: {
    height: "100%",
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderColor: "#efefef",
    borderWidth: 1,
  },
  pmImg: {
    width: 20,
    height: 20,
    objectFit: "contain",
  },
  groupImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderColor: "#efefef",
    borderWidth: 1,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  groupInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 17,
    fontWeight: "600",
  },
  groupName: {
    fontSize: 17,
    fontWeight: "600",
  },
  lastMessage: {
    color: "#777",
  },
  lastMessageTime: {
    color: "#777",
  },
  userCount: {
    color: "#777",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  statusContainer: {
    marginRight: 0,
    marginBottom: 0,
  },
  messageCountContainer: {
    backgroundColor: "#00c0ff",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  messageCount: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  timingText: {
    color: "#777",
    marginLeft: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: Platform.OS == "ios" ? 35 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    backgroundColor: "#f7f7f7",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  iconButton: {
    marginLeft: 10,
  },
  backButton: {
    marginRight: 10,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleText: {
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: "700",
  },
  containerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});

export default ChatUserLists;
