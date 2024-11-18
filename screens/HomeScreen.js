import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useContext, useEffect } from "react";
import {
  Pressable,
  GestureHandlerRootView,
  TextInput,
  ScrollView,
} from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SliderBox } from "react-native-image-slider-box";
import { Image } from "react-native";
import ScrollViewforMe from "../component/ScrollView";
import { useState } from "react";
import axios from "axios";
import ProductItem from "../component/ProductItem";
import DropDownPicker from "react-native-dropdown-picker";
import ModalDropdown from "../component/ModalDropdown";
import { list, images, deals, offers } from "../api/data/data-home";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import jwt_decode from "jwt-decode";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AddressContext } from "../AddressContext";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("electronics");
  const { userId, setUserId } = useContext(UserType);
  const { selectedAddress, setSelectedAdress } = useContext(AddressContext);
  const [dealcategory, setDealCategory] = useState("Mobiles");
  const [items, setItems] = useState([
    { label: "Men's clothing", value: "men's clothing" },
    { label: "jewelery", value: "jewelery" },
    { label: "electronics", value: "electronics" },
    { label: "women's clothing", value: "women's clothing" },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
      } catch (error) {
        console.log("error message", error);
      }
    };
    fetchData();
  }, []);

  const cart = useSelector((state) => state.cart.cart);
  // console.log(products)
  // console.log(JSON.stringify(cart, null, 2))
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);

  const fetchAddresses = async () => {
    try {
      // console.log("Fetching user document for userId:", userId);
      const userDocRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDocRef);
  
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const addressList = userData.addresses || [];  // Assuming `addresses` is a field in the user document
        // console.log("Fetched addresses:", addressList);
        setAddresses(addressList);
      } else {
        console.log("No user document found for userId:", userId);
      }
    } catch (error) {
      console.log("Error fetching user document:", error);
    }
  };

 
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const userId = token
      setUserId(userId);
    };
    fetchUser();
  }, []);

  console.log("address", addresses);
  console.log("selectAddress:", selectedAddress);
  console.log("DealCategory", dealcategory);
  console.log("UserId:", userId)

  return (
    <>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ScrollView>
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

            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                padding: 10,
                backgroundColor: "#AFEEEE",
                flex: 1,
              }}
            >
              <Ionicons name="location-outline" size={24} color="black" />
              <Pressable>
                {selectedAddress ? (
                  <Text>
                    Deliver to {selectedAddress?.name} -{" "}
                    {selectedAddress?.street}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 13, fontWeight: "500" }}>
                    Add a Address
                  </Text>
                )}
              </Pressable>

              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="black"
              />
            </Pressable>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {list.map((item, index) => (
                <TouchableOpacity
                  onPress={() => setDealCategory(item.name)}
                  key={`list-${item.id}-${index}`}
                  style={{
                    margin: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50, resizeMode: "contain" }}
                    source={{ uri: item.image }}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: "500",
                      marginTop: 5,
                    }}
                  >
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <SliderBox
              images={images}
              autoplay
              circleLoop
              dotColor={"#13274F"}
              inactiveDotColor="#90A4AE"
              ImageComponentStyle={{ width: "100%" }}
            />

            <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
              Trending Deals of the week
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {deals
                .filter((item) => item.category === dealcategory)
                .map((item, index) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Info", {
                        id: item.id,
                        title: item.title,
                        price: item?.price,
                        carouselImages: item.carouselImages,
                        color: item?.color,
                        size: item?.size,
                        oldPrice: item?.oldPrice,
                        item: item,
                        selectedAddress: selectedAddress,
                      })
                    }
                    key={`deal-${item.id}-${index}`}
                    style={{
                      marginHorizontal: 5,
                      marginVertical: 10,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ width: 180, height: 180, resizeMode: "contain" }}
                      source={{ uri: item.image }}
                    />
                  </TouchableOpacity>
                ))}
            </View>

            <Text
              style={{
                height: 1,
                borderColor: "#D0D0D0",
                borderWidth: 2,
                marginTop: 15,
              }}
            />

            <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
              Today's Deals
            </Text>
            <ScrollViewforMe horizontal showsHorizontalScrollIndicator={false}>
              {offers.map((item, index) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Info", {
                      id: item.id,
                      title: item.title,
                      price: item?.price,
                      carouselImages: item.carouselImages,
                      color: item?.color,
                      size: item?.size,
                      oldPrice: item?.oldPrice,
                      item: item,
                    })
                  }
                  key={`offer-${item.id}-${index}`}
                  style={{
                    marginVertical: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{ width: 150, height: 150, resizeMode: "contain" }}
                    source={{ uri: item?.image }}
                  />
                  <View
                    style={{
                      backgroundColor: "#E31837",
                      paddingVertical: 5,
                      width: 130,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                    >
                      Upto{item?.offer}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollViewforMe>

            <Text
              style={{
                height: 1,
                borderColor: "#D0D0D0",
                borderWidth: 2,
                marginTop: 15,
              }}
            />

            <View
              style={{
                marginHorizontal: 10,
                marginTop: 20,
                width: "45%",
                marginBottom: open ? 50 : 15,
              }}
            >
              <ModalDropdown
                selectedValue={category}
                onValueChange={setCategory}
                items={items}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {products
                ?.filter((items) => items.category === category)
                .map((item, index) => (
                  <ProductItem
                    key={`product-${item.id}-${index}`}
                    item={item}
                    index={index}
                  />
                ))}
            </View>
          </ScrollView>
        </GestureHandlerRootView>
      </SafeAreaView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 400 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Choose your location
            </Text>
            <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
              Select a delivery location to see products availability and
              delivery options
            </Text>
          </View>
          <ScrollViewforMe horizontal showsHorizontalScrollIndicator={false}>
            {/* already added address */}
            {addresses.map((item, index) => (
              <TouchableOpacity
                key={`addresses-${item.id}-${index}`}
                onPress={() => setSelectedAdress(item)}
                style={{
                  width: 140,
                  height: 140,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 3,
                  marginRight: 15,
                  marginTop: 10,
                  backgroundColor:
                    selectedAddress === item ? "#FBCEB1" : "white",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                    {item?.name}
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.houseNo},{item?.landmark}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.street}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  Thailand, Bangkok
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address", {
                  selectedAddress: selectedAddress,
                  // setSelectedAdress: setSelectedAdress
                });
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0066b2",
                  fontWeight: 500,
                }}
              >
                Add an Address or pick-up point
              </Text>
            </TouchableOpacity>
          </ScrollViewforMe>

          {/* <View style={{ flexDirection: "column", gap: 7, marginBottom: 30 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="location-pin" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Enter an Thailand pincode
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="locate-sharp" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Use My Current location
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <AntDesign name="earth" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Deliver outside Thailand
              </Text>
            </View>
          </View> */}
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
