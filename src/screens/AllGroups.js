import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavBar from "../navigation/BottomNavBar";
import { useSelector, useDispatch } from "react-redux";
import { memoizedgroupList } from "../selectors";
import {
  fetchGroupList,
  createGroupConversation,
} from "../reducers/groupListSlice";

const AllGroupsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const club = route.params.club;
  const toggleState = route.params.toggleState;
  const AsUser = route.params.AsUser;
  const groupList = useSelector(memoizedgroupList);
  const loading = useSelector((state) => state.groupList.loading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchGroupList(club?.post_id));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, navigation, AsUser]);

  const createConversation = (group_id, group_name) => {
    setIsLoading(true);
    let payload = {
      user_id: AsUser,
      group_id: group_id,
      group_name: group_name,
    };
    dispatch(createGroupConversation(payload))
      .then((data) => {
        const conversation = data?.data;
        navigation.navigate("ChatDashboard", {
          conversation,
          AsUser,
          toggleState,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
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
        <View style={styles.headerTextView}>
          <Text style={styles.headerText}>Add a team chat contact group</Text>
          {club?.post_title ? (
            <Text style={styles.headerSubText}>{club?.post_title}</Text>
          ) : null}
        </View>
      </View>
      {loading || isLoading ? (
        <View style={styles.containerLoader}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={groupList}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.groupItem} onPress={() => createConversation(item?.id, item?.name)}>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.membersCount}>
                  {item.member_count} members
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {/*<Button
        title="Create Group"
        onPress={createGroup}
        color="#00c0ff" // Set the button's background color
        style={styles.createGroupButton} // Apply custom styles
      />*/}
      <BottomNavBar toggleState={toggleState} club={club} AsUser={AsUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  membersCount: {
    fontSize: 14,
    color: "#777",
  },
  radio: {
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS == "ios" ? 55 : 30,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    backgroundColor: "#f7f7f7",
  },
  headerText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  headerTextView: {
    flex: 1,
  },
  backButton: {
    marginRight: 10,
  },
  createGroupButton: {
    marginTop: 16,
    padding: 16,
    fontSize: 16,
  },
  containerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AllGroupsScreen;
