import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Text,
  StatusBar,
  Dimensions,
} from "react-native";
//import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  useNavigation,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

const BottomNavBar = ({ onSearch, toggleState, club, AsUser, onSearchTermChange }) => {
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  const searchInputRef = useRef(null);

  const isFocused = useIsFocused();
  const route = useRoute(); // Get the current route

  const navigation = useNavigation();

  const toggleSearchBar = () => {
    if(onSearchTermChange){
      setIsSearchBarVisible(!isSearchBarVisible);
      setIsOverlayVisible(false);
    }else{
      alert('Please goto club list or chat list');
    }
  };

  useEffect(() => {
    // Determine the active item based on the current screen
    const currentRouteName = route.name;

    switch (currentRouteName) {
      case "ClubList":
        setActiveItem("ClubList");
        break;
      case "SettingsPage":
        setActiveItem("SettingsPage");
        break;
      case "UserProfile":
        setActiveItem("UserProfile");
        break;
      case "AllUserList":
        setActiveItem("AllUserList");
        break;
      case "AllGroups":
        setActiveItem("AllGroups");
        break;
      default:
        setActiveItem("Home");
        break;
    }
  }, [isFocused, route]);

  const handleClub = () => {
    navigation.navigate("ClubList");
  };

  const handleSetting = () => {
    navigation.navigate("SettingsPage");
  };

  const handleProfile = () => {
    navigation.navigate("UserProfile");
  };

  const handleAddContact = () => {
    setIsOverlayVisible(false);
    navigation.navigate("AllUserList", { toggleState, club, AsUser });
  };

  const handleCreateGroup = () => {
    setIsOverlayVisible(false);
    navigation.navigate("AllGroups", { club, AsUser });
  };

  const closeOverlay = () => {
    setIsOverlayVisible(false);
  };

  const windowHeight = Dimensions.get("window").height;

  return (
    <Animatable.View style={styles.container} animation="slideInUp">
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            activeItem === "ClubList" && styles.activeNavItem,
          ]}
          onPress={handleClub}
        >
          {/*<FontAwesome
            name="comment"
            size={24}
            color={activeItem === "ClubList" ? "#00c0ff" : "#000"}
        />*/}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            activeItem === "Search" && styles.activeNavItem,
          ]}
        >
          {/*<FontAwesome
            name="search"
            size={24}
            color={activeItem === "Search" ? "#00c0ff" : "#000"}
            onPress={toggleSearchBar}
        />*/}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            styles.middleButton,
            activeItem === "AddContact" && styles.activeNavItem,
          ]}
          onPress={() => {
            if (!club) {
              alert("Please select a club first.");
            } else {
              setIsOverlayVisible(!isOverlayVisible);
            }
          }}
        >
          {/*<AntDesign
            name="plus"
            size={24}
            color={activeItem === "AddContact" ? "#00c0ff" : "#fff"}
        />*/}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            activeItem === "SettingsPage" && styles.activeNavItem,
          ]}
          onPress={handleSetting}
        >
          {/*<MaterialIcons
            name="settings"
            size={24}
            color={activeItem === "SettingsPage" ? "#00c0ff" : "#000"}
        />*/}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            activeItem === "UserProfile" && styles.activeNavItem,
          ]}
          onPress={handleProfile}
        >
          {/*<FontAwesome
            name="user"
            size={24}
            color={activeItem === "UserProfile" ? "#00c0ff" : "#000"}
        />*/}
        </TouchableOpacity>
      </View>
      {isSearchBarVisible && (
        <View style={styles.searchBarContainer}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search"
            //onChangeText={(text) => onSearchTermChange(text)}
            //onSubmitEditing={(e) => onSearchTermChange(e.nativeEvent.text)}
            onChangeText={(e) => {
              searchInputRef.current.value = e;
              onSearchTermChange(e);
            }}
            onSubmitEditing={() => {
              const searchTerm = searchInputRef.current.value;
              onSearchTermChange(searchTerm);
            }}
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => {
            const searchTerm = searchInputRef.current.value;
            onSearchTermChange(searchTerm);
          }}>
            {/*<FontAwesome
              name="search"
              size={20}
              color={activeItem === "Search" ? "#00c0ff" : "#000"}
        />*/}
          </TouchableOpacity>
        </View>
      )}
      {isOverlayVisible && (
        <Animatable.View
          style={[
            styles.overlay,
            {
              opacity: 1,
            },
          ]}
          animation="fadeIn"
          duration={500}
          easing="ease-in-out"
        >
          <Text style={styles.headingTexts}>{toggleState ? "Add User" : "Add User or Group"}</Text>
          <TouchableOpacity
            style={styles.overlayButton}
            onPress={handleAddContact}
          >
            <Text style={styles.buttonTexts}>Add Contact</Text>
          </TouchableOpacity>
          {toggleState ? null : (
            <TouchableOpacity
              style={styles.overlayButton}
              onPress={handleCreateGroup}
            >
              <Text style={styles.buttonTexts}>Add Group</Text>
            </TouchableOpacity>
          )}
        </Animatable.View>
      )}
      {isOverlayVisible && (
        <TouchableOpacity
          style={[
            styles.transparentOverlay,
            {
              height: windowHeight,
              opacity: 1,
            },
          ]}
          onPress={closeOverlay}
        />
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === "ios" ? 15 : 5,
    borderTopWidth: 1,
    borderTopColor: "#efefef",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  transparentOverlay: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    left: 0,
    right: 0,
    padding: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 9,
    backgroundColor: "#fff",
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius:8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeNavItem: {
    backgroundColor:"#efefef"
  },
  middleButton: {
    width: 50,
    height: 50,
    backgroundColor: "#00c0ff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#efefef",
    borderRadius: 25,
    paddingHorizontal: 10,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingVertical: 0,
  },
  searchButton: {
    padding: 8,
  },
  overlay: {
    overflow: "hidden",
    position: "absolute",
    bottom: 66,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9,
  },
  overlayButton: {
    width: "100%",
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#00c0ff",
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#00c0ff",
    textTransform: "uppercase",
    color: "#fff",
    textAlign: "center",
  },
  buttonTexts: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
  },
  headingTexts: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
});

export default BottomNavBar;
