import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScrollViewforMe from "../component/ScrollView";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const EditAddressScreen = () => {
  const route = useRoute(); // Get route params
  const { address, userId } = route.params; // Pass the address and userId from previous screen
  const navigation = useNavigation();
  
  const [name, setName] = useState(address?.name || "");
  const [mobileNo, setMobileNo] = useState(address?.mobileNo || "");
  const [houseNo, setHouseNo] = useState(address?.houseNo || "");
  const [street, setStreet] = useState(address?.street || "");
  const [landmark, setLandmark] = useState(address?.landmark || "");
  const [postalCode, setPostalCode] = useState(address?.postalCode || "");

  // console.log(userId)
  // Function to handle address update
  const handleUpdateAddress = async () => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const addresses = userData.addresses || [];
  
        // Find the index of the address to update using a unique property
        const addressIndex = addresses.findIndex((addr) => addr.id === address.id); // Find address by id
  
        if (addressIndex !== -1) {
          // Update the specific address
          addresses[addressIndex] = {
            ...addresses[addressIndex],
            name,
            mobileNo,
            houseNo,
            street,
            landmark,
            postalCode,
          };
  
          await updateDoc(userDocRef, { addresses });
          Alert.alert("Success", "Address updated successfully!");
          navigation.goBack();
        } else {
          Alert.alert("Error", "Address not found.");
        }
      } else {
        console.log("User document does not exist!");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      Alert.alert("Error", "Failed to update address. Please try again.");
    }
  };
  

  return (
    <ScrollViewforMe style={{ marginTop: 50 }}>
    <View style={{ height: 50, backgroundColor: "#00CED1" }} />

    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 17, fontWeight: "bold" }}>
        Edit a new Address
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
      onPress={handleUpdateAddress}
      style={{
          backgroundColor: "#FFC72C",
          padding: 19,
          borderRadius: 6,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}>
        <Text style={{ fontWeight: "bold" }}>Edit Address</Text>
      </TouchableOpacity>
    </View>
  </ScrollViewforMe>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#008397",
    padding: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditAddressScreen;
