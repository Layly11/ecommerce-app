import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Pressable,
    Image,
    KeyboardAvoidingView,
    TextInput,
    Alert,
  } from "react-native";
  import React, { useState } from "react";
  import { MaterialIcons } from "@expo/vector-icons";
  import { AntDesign } from "@expo/vector-icons";
  import { Ionicons } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  import axios from "axios";
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from '../firebaseConfig'; // Import Firebase configuration
import { doc, setDoc } from "firebase/firestore";
  
  const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigation = useNavigation();
    const handleRegister = () => {
      const auth = getAuth();
    
      // Check if password length is less than 6 before proceeding
      if (password.length < 6) {
        Alert.alert("Registration Error", "Password must be at least 6 characters long.");
        return; // Return early to stop further execution
      }
    
      createUserWithEmailAndPassword(auth, email, password)
        .then( async (userCredential) => {
          const user = userCredential.user;
          console.log("Registration Success:", user.uid);

          try {
            await setDoc(doc(db, "users", user.uid), {
              name: name,
              email: email,
              password: password, // It's better to hash passwords, avoid storing plain text
              verified: false, // Initially set as false
              verificationToken: user.uid, // You can generate a token if you need email verification
              addresses: [], // Initialize with an empty array
              orders: [], // Initialize with an empty array
              createdAt: new Date(), // Set creation date
            });
            console.log("Success saving user data to Firestore:");
            navigation.goBack()
          }catch (error){
            console.log("Error saving user data to Firestore:", error);
          }
          
          Alert.alert("Registration successful", "You have been registered successfully");
          setName("");
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          // Firebase Auth Error Handling
          switch (error.code) {
            case "auth/email-already-in-use":
              Alert.alert("Registration Error", "This email address is already in use.");
              break;
            case "auth/invalid-email":
              Alert.alert("Registration Error", "Invalid email address format.");
              break;
            case "auth/weak-password":
              Alert.alert("Registration Error", "Password must be at least 6 characters long.");
              break;
            default:
              Alert.alert("Registration Error", "An unexpected error occurred. Please try again.");
          }
          console.log("Registration failed:", error.message);
        });
    };
    
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "white", alignItems: "center",marginTop:50  }}
      >
        <View>
          <Image
            style={{ width: 150, height: 100 }}
            source={{
              uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
            }}
          />
        </View>
  
        <KeyboardAvoidingView>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginTop: 12,
                color: "#041E42",
              }}
            >
              Register to your Account
            </Text>
          </View>
  
          <View style={{ marginTop: 70 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#D0D0D0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <Ionicons
                name="person"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: name ? 16 : 16,
                }}
                placeholder="enter your name"
              />
            </View>
  
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#D0D0D0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <MaterialIcons
                style={{ marginLeft: 8 }}
                name="email"
                size={24}
                color="gray"
              />
  
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 16 : 16,
                }}
                placeholder="enter your Email"
              />
            </View>
          </View>
  
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#D0D0D0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <AntDesign
                name="lock1"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
  
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: email ? 16 : 16,
                }}
                placeholder="enter your Password"
              />
            </View>
          </View>
  
  
          <View style={{ marginTop: 80 }} />
  
          <Pressable
            onPress={handleRegister}
            style={{
              width: 200,
              backgroundColor: "#FEBE10",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Register
            </Text>
          </Pressable>
  
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Already have an account? Sign In
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default RegisterScreen;
  
  const styles = StyleSheet.create({});
  