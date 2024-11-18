import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ScrollViewforMe from "../component/ScrollView";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { UserType } from "../UserContext";
import { useContext } from "react";
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { Alert } from "react-native";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AddressContext } from "../AddressContext";
const AddAddressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const { setSelectedAdress } = useContext(AddressContext);
  // console.log("userId",userId)

  useEffect(() => {
    fetchAddresses();
  }, []);
  // console.log(userId)

  const fetchAddresses = async () => {
    try {
      // console.log("Fetching user document for userId:", userId);
      const userDocRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const addressList = userData.addresses || []; // Assuming `addresses` is a field in the user document
        // console.log("Fetched addresses:", addressList);
        setAddresses(addressList);
      } else {
        console.log("No user document found for userId:", userId);
      }
    } catch (error) {
      console.log("Error fetching user document:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    })
  );

  // console.log(addresses)

  const deleteAddress = async (address) => {
    try {
      console.log("Deleting address:", address, "for userId:", userId);

      // Create a reference to the user's document
      const userDocRef = doc(db, "users", userId);

      // Use arrayRemove to remove the specific address from the array
      await updateDoc(userDocRef, {
        addresses: arrayRemove(address), // Firestore will remove this specific object from the array
      });

      // Refresh addresses after deletion
      await fetchAddresses();

      console.log("Address deleted successfully");
    } catch (error) {
      console.log("Error deleting address:", error);
    }
  };

  const confirmDelete = (addressId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Yes",
          onPress: () => deleteAddress(addressId),
        },
        {
          text: "No",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel",
        },
      ]
    );
  };

  return (
    <ScrollViewforMe
      showsVerticalScrollIndicator={false}
      style={{ marginTop: 50 }}
    >
      <View
        style={{
          backgroundColor: "#00CED1",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 38,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="search1"
            size={24}
            color="black"
          />
          <TextInput placeholder="Search Amazon.in" />
        </Pressable>
        <Feather name="mic" size={24} color="black" />
      </View>

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Your Address</Text>
        <Pressable
          onPress={() => navigation.navigate("Add")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            paddingVertical: 7,
            paddingHorizontal: 5,
          }}
        >
          <Text>Add a new Address</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </Pressable>

        <TouchableOpacity>
          {/* all the added address */}
          {addresses.map((item, index) => (
            <TouchableOpacity
              key={`Addaddress-${item.id}-${index}`}
              style={{
                borderWidth: 1,
                borderColor: "#D0D0D0",
                padding: 10,
                flexDirection: "column",
                gap: 5,
                marginVertical: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item?.name}
                </Text>
                <Entypo name="location-pin" size={24} color="red" />
              </View>

              <Text style={{ fontSize: 15, color: "#181818" }}>
                {item?.houseNo}, {item?.landmark}
              </Text>

              <Text style={{ fontSize: 15, color: "#181818" }}>
                {item?.street}
              </Text>

              <Text style={{ fontSize: 15, color: "#181818" }}>
                Thailand, Bangkok
              </Text>

              <Text style={{ fontSize: 15, color: "#181818" }}>
                phone No : {item?.mobileNo}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                pin code : {item?.postalCode}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 7,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditAddress", {
                      address: item,
                      userId,
                    })
                  }
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 5,
                    borderWidth: 0.9,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => confirmDelete(item)}
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 5,
                    borderWidth: 0.9,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>Remove</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedAdress(item)} // Ensure the name matches
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 5,
                    borderWidth: 0.9,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>Set as Default</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      </View>
    </ScrollViewforMe>
  );
};
export default AddAddressScreen;

const styles = StyleSheet.create({});
