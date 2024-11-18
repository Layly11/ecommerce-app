import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React,{useContext, useEffect, useState} from "react";
import ScrollViewforMe from "../component/ScrollView";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { Alert } from "react-native";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"


const AddressScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const {userId,setUserId} = useContext(UserType)

  useEffect(()=>{
    const fetchUser = async() =>{
      const token = await AsyncStorage.getItem("authToken")
      const userId = token
      setUserId(userId)
    }
    fetchUser()
  },[])
  console.log(userId)

  const handleAddAddress = async () => {
    if (!userId) {
      Alert.alert("Error", "User not found");
      return;
    }

    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const addresses = {
      id,
      name,
      mobileNo,
      houseNo,
      street,
      landmark,
      postalCode,
    };
  
    try {
      const userDocRef = doc(db, "users", userId); // Correct Firestore reference
      await updateDoc(userDocRef, {
        addresses: arrayUnion(addresses), // Add the new address to the addresses array
      });
  
      Alert.alert("Success", "Address added successfully");
  
      // Clear input fields after successful addition
      setName("");
      setMobileNo("");
      setHouseNo("");
      setStreet("");
      setLandmark("");
      setPostalCode("");
  
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (error) {
      Alert.alert("Error", "Failed to add address");
      console.log("Error adding address:", error);
    }
  };
  return (
    <ScrollViewforMe style={{ marginTop: 50 }}>
      <View style={{ height: 50, backgroundColor: "#00CED1" }} />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>
          Add a new Address
        </Text>
        <TextInput
          placeholder="Thailand"
          placeholderTextColor={"black"}
          style={{
            padding: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            marginTop: 10,
            borderRadius: 5,
          }}
          readOnly
        />

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Full name (First and last name)
          </Text>
          <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="enter your name"
          />
        </View>

        <View>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Mobile number
          </Text>

          <TextInput
          value={mobileNo}
          onChangeText={(text) => setMobileNo(text)}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Mobile No"
          />
        </View>

        <View style={{marginVertical:10}}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Flat,House No,Building,Company</Text>
          <TextInput
          value={houseNo}
          onChangeText={(text) => setHouseNo(text)}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder=""
          />
        </View>

        <View>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Area,Street,sector,village</Text>
          <TextInput
          value={street}
          onChangeText={(text) => setStreet(text)}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder=""
          />
        </View>

        <View style={{marginVertical:10}}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Landmark</Text>
          <TextInput
          value={landmark}
          onChangeText={(text) => setLandmark(text)}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Tecnology Mahanakorn University"
          />
        </View>

        <View>
          <Text style={{fontSize:15, fontWeight:"bold"}}>Pincode</Text>
          <TextInput
          value={postalCode}
          onChangeText={(text)=> setPostalCode(text)}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Enter Pincode"
          />
        </View>

        <TouchableOpacity     
        onPress={handleAddAddress}
        style={{
            backgroundColor: "#FFC72C",
            padding: 19,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}>
          <Text style={{ fontWeight: "bold" }}>Add Address</Text>
        </TouchableOpacity>
      </View>
    </ScrollViewforMe>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({});
