import React, { useState } from "react";
import { login } from "../actions/auth";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import bgImg from "../assets/chat-bg.png";
import { useDispatch } from "react-redux";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const handleLogin = () => {
    if (!email || !password) {
      // Check if email or password is empty
      alert("Please enter both email/username and password.");
      return;
    }

    if (!email) {
      // Check if email is empty
      alert("Please enter your email or username.");
      return;
    }

    if (!password) {
      // Check if password is empty
      alert("Please enter your password.");
      return;
    }

    let user = {
      username: email,
      password: password,
    };
    dispatch(login(user))
      .then((response) => {
        if (response.status == "success") {
          //navigation.navigate("ClubList");
          navigation.reset({
            index: 1,
            routes: [{ name: "ClubList" }],
          });
        }
      })
      .catch((error) => {});
  };

  //const handleForgotPassword = () => {
 //   navigation.navigate("ForgotPassword");
 // };

  const imgProps = Image.resolveAssetSource(bgImg).uri;
  const image = { uri: imgProps };

  return (
    <View style={[styles.top_main]} contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground style={styles.img_top} source={image} resizeMode="cover">
        <View style={styles.container}>
          <View style={styles.logoBox}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <Text style={styles.title}>Team Chat</Text>
          </View>
          <View style={styles.card}>
            <Text style={[styles.smallText, styles.forText]}>
              Login with your Booostr user account to begin chatting with your
              team in real-time!
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
            {loading ? (
              <View style={styles.loader}>
                <ActivityIndicator color="#00c0ff" />
              </View>
            ) : (
              <PaperButton
                mode="contained"
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Login</Text>
              </PaperButton>
            )}
           {/* <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordMain}
            >
              <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>*/}
          </View>
          <View style={styles.BottomText}>
            
            <Text style={[styles.smallText, styles.ForWidth]}>
              To access Booostr Team Chat for your organization, you need to
              have a Booostr user account. If you do not have a Booostr user
              account but need to connect with a club or nonprofit using Booostr
              Team Chat, you can
              <Text
                style={styles.BlueText}
                onPress={() => Linking.openURL("https://example.com")}
              >
                create a free user account on Booostr.co.
              </Text>
              Desktop chat is also available
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width:500,
    marginHorizontal:'auto',
  },
  img_top: {
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: 40,
  },
  smallText: {
    color: "#a9a9a9",
    textAlign: "center",
    marginVertical: 20,
  },
  BottomText: {
    width: "80%",
    alignItems: "center",
  },
  BlueText: {
    color: "#00b0ef",
    textDecorationLine: "underline",
  },
  card: {
    width: "80%",
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
    backgroundColor: "white",
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  logoBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00b0ef",
    width: "80%",
    padding: 20,
    textAlign: "center",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    textTransform: "capitalize",
    color: "#fff",
  },
  input: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#00c0ff",
    borderRadius: 6,
    fontSize: 15,
    backgroundColor: "#e7effc",
    lineHeight: 19,
    fontWeight: "400",
    fontStyle: "normal",
    color: "#515151",
    maxWidth: "100%",
    padding: 13,
  },
  button: {
    width: "100%",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#00c0ff",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#00c0ff",
    textTransform: "uppercase",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
  forgotPasswordMain: {
    color: "#a9a9a9",
    fontSize: 20,
    marginVertical: 15,
  },
  forgotPassword: {
    color: "#a9a9a9",
    fontSize: 18,
  },
  top_main: {
    flex: 1,
  },
  forText: {
    fontSize: 15,
  },
  loader: {
    marginTop: 10,
  },
});

export default LoginScreen;
