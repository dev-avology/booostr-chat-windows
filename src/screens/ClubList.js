import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
} from "react-native";
import BottomNavBar from "../navigation/BottomNavBar";
import { fetchClubList } from "../reducers/clubListSlice";
import { useDispatch, useSelector } from "react-redux";
import { memoizedSelectclubList } from "../selectors";
import { useFocusEffect } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { searchArray } from "../searchUtils";

const Tab = createMaterialTopTabNavigator();


const ManagerClubScreen = ({clubs,renderItem})=>{
return (<>
                <SectionList
                  sections={[
                    {
                      data: clubs,
                    },
                  ]}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.post_id}
                />

</>);
}

const SupportClubScreen = ({clubs,renderItem})=>{
  return (<>
    <SectionList
      sections={[
        {
          data: clubs,
        },
      ]}
      renderItem={renderItem}
      keyExtractor={(item) => item.post_id}
    />

</>);
}





const ClubList = ({ navigation }) => {
  const dispatch = useDispatch();
  const [clubs, setClubs] = useState([]);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleClubClick = (club) => {
    navigation.navigate("ChatUserLists", { club });
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const filteredClubs = searchArray(clubs, searchTerm, (item) => {
    return item.post_title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.clubItem}
      onPress={() => handleClubClick(item)}
    >
      <View style={styles.clubImageContainer}>
        {item?.user_photo && typeof item.user_photo === "string" && (
          <Image source={{ uri: item.user_photo }} style={styles.clubImage} />
        )}
      </View>
      <View style={styles.clubInfo}>
        <Text style={styles.clubName}>{item?.post_title}</Text>
      </View>
    </TouchableOpacity>
  );

  const CurrentUserID = useSelector(
    (state) => JSON.parse(state.auth.userData)?.user_id
  );
  const clubList = useSelector(memoizedSelectclubList);
  const loading = useSelector((state) => state.clubList.loading);
  const error = useSelector((state) => state.clubList.error);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          if (CurrentUserID) {
            dispatch(fetchClubList(CurrentUserID));
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, [])
  );

  useEffect(() => {
    if (!loading && !error) {
      try {
        const parsedClubList = clubList;
        if (parsedClubList && Array.isArray(parsedClubList.clubs)) {
          setClubs(parsedClubList?.clubs);
        } else {
          setClubs([]);
        }
      } catch (parseError) {
        console.error("Error parsing clubList:", parseError);
        setClubs([]);
      }
    } else {
      setClubs([]);
    }
  }, [clubList, loading, error]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* <Text style={styles.headerText}>Select a Club</Text> */}
          <Text style={styles.wrapText}>
            Choose a club you support or manage to join a chat.
          </Text>
        </View>
        <View style={styles.headerRight}>
          {/* Commenting out the renderSearchBar call */}
          {/* {renderSearchBar()} */}
        </View>
      </View>
      {isSearchBarVisible && <View style={styles.searchBarSpace} />}
      <View style={styles.clubListContainer}>
        {loading ? (
          <View style={styles.containerLoader}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : clubs.length > 0 ? (
          <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 15, fontWeight: 600 },
            tabBarStyle: {},
          }}
          >
         <Tab.Screen name="Managed Club" options={{ title: "Managed Club" }}>
            {() =>
               filteredClubs.filter(item => item.role === "manager")?.length > 0 ? (
                <ManagerClubScreen clubs={filteredClubs.filter(item => item.role === "manager")}  renderItem={renderItem} ></ManagerClubScreen>
              ) : (
                <Text style={styles.notFound}>No Manger club found.</Text>
              )
            }
          </Tab.Screen>
          <Tab.Screen name="Supported Club" options={{ title: "Supported Club" }}>
            {() =>
              filteredClubs.filter(item => item.role === "support")?.length > 0 ? (
                <SupportClubScreen clubs={filteredClubs.filter(item => item.role === "support")} renderItem={renderItem}></SupportClubScreen>
              ) : (
                <Text style={styles.notFound}>No support club found.</Text>
              )
            }
          </Tab.Screen>
          </Tab.Navigator>

        ) : (
          <Text style={styles.notFound}>No clubs found.</Text>
        )}
      </View>
      <BottomNavBar onSearchTermChange={handleSearchTermChange}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  clubListContainer: {
    flex: 1,
  },
  clubItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    backgroundColor:"#fdfdfd"
  },
  wrapText: {
    fontSize: 14,
    marginTop: 3,
    color: "#777",
  },
  clubImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  clubImage: {
    width: "100%",
    height: "100%",
  },
  clubInfo: {
    flex: 1,
    marginLeft: 16,
  },
  clubName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  membersCount: {
    color: "#777",
  },
  top_main: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS == "ios" ? 55 : 30,
    paddingBottom: 25,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  iconButton: {
    marginLeft: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#efefef",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchBarSpace: {
    height: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingVertical: 0,
  },
  notFound: {
    textAlign: "center",
    fontSize: 20,
    padding: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ClubList;
