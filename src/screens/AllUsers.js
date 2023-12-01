import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavBar from "../navigation/BottomNavBar";
import {
  fetchUserContactList,
  fetchClubContactList,
  createChatConversation,
} from "../reducers/contactListSlice";
import { memoizedcontactList } from "../selectors";
import userPlaceholder from "../assets/user1.png";
import profileManager from "../assets/pm.png";

const Stack = createNativeStackNavigator();

const AllUserListScreen = ({ route, navigation }) => {
  //const navigation = useNavigation();
  const dispatch = useDispatch();
  const club = route.params.club;
  const toggleState = route.params.toggleState;
  const AsUser = route.params.AsUser;
  const contactList = useSelector(memoizedcontactList);
  const loading = useSelector((state) => state.contactList.loading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (toggleState) {
          dispatch(fetchUserContactList(club?.post_id, AsUser));
        } else {
          dispatch(fetchClubContactList(club?.post_id));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, navigation, AsUser]);

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

  const createConversation = (user_id, club_id) => {
    let payload = {};
    if (toggleState) {
      payload = {
        users: [user_id],
        user_id: AsUser,
        role: "member",
        club_id: club_id,
        conversation_type: "one-to-one",
      };
    } else {
      payload = {
        users: [user_id],
        user_id: AsUser,
        role: "club",
        club_id: club_id,
        conversation_type: "one-to-one",
      };
    }
    dispatch(createChatConversation(payload))
      .then((data) => {
        const conversation = data?.data;
        navigation.navigate("ChatDashboard", {
          conversation,
          AsUser,
          toggleState,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Contact</Text>
      </View>
      {loading ? (
        <View style={styles.containerLoader}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={contactList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => createConversation(item?.user_id, club?.post_id)}
            >
              {item ? (
                <>
                  <View style={styles.statusContainer}>
                    {item?.user_photo ? (
                      <Image
                        source={{ uri: item?.user_photo }}
                        style={styles.userImage}
                      />
                    ) : (
                      <Image
                        source={userPlaceholder}
                        style={styles.userImage}
                      />
                    )}
                    {renderStatusIndicator(item?.status)}
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {item?.first_name} {item?.last_name}{" "}
                      {item?.profile_manager ? (
                        <Image source={profileManager} style={styles.pmImg} />
                      ) : null}
                    </Text>
                  </View>
                </>
              ) : null}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.user_id} // Use item.id as the key
        />
      )}
      <BottomNavBar toggleState={toggleState} club={club} AsUser={AsUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#efefef",
    borderWidth: 1,
  },
  pmImg: {
    width: 20,
    height: 20,
    objectFit: "contain",
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessage: {
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
    marginRight: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS == "ios" ? 40 : 20,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    backgroundColor: "#fff",
  },
  headerText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    marginRight: 10,
  },
  containerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AllUserListScreen;
