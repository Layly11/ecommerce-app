import { Pressable, StyleSheet, Text, View, TextInput,Image, } from "react-native";
import React from "react";
import ScrollViewforMe from "../component/ScrollView";
import { AntDesign } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incementQuantity,
  removeFromCart,
  setCart
} from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";



const CartScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  console.log("Cart:", JSON.stringify(cart, null, 2));
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);
  const dispatch = useDispatch();

  // Increase quantity
  const increaseQuantity = (item) => {
    dispatch(incementQuantity(item));
    saveCart([...cart, item]); // Save cart after change
  };

  // Decrease quantity or remove item
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(decrementQuantity(item));
      saveCart([...cart]); // Save cart after change
    } else {
      deleteItem(item);
    }
  };

  // Delete item from cart
  const deleteItem = (item) => {
    dispatch(removeFromCart(item));
    saveCart(cart.filter(cartItem => cartItem._id !== item._id)); // Save cart after change
  };
  const navigation = useNavigation();

  const saveCart = async (cart) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.log("Error saving cart to AsyncStorage:", error);
    }
  };

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart !== null) {
        dispatch(setCart(JSON.parse(storedCart))); // Set the cart from local storage
      }
    } catch (error) {
      console.log("Error loading cart from AsyncStorage:", error);
    }
  };
  

  useEffect(() => {
    loadCart(); // Load the cart when the component mounts
  }, []);
  return (
    <ScrollViewforMe
      style={{ marginTop: 55, flex: 1, backgroundColor: "white" }}
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

      <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "400" }}>Subtotal : </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{total}</Text>
      </View>
      <Text style={{ marginHorizontal: 10 }}>EMI details Available</Text>

      <Pressable
        onPress={() => {
            if (total > 0) {
                navigation.navigate("Confirm");
              } else {
                Alert.alert("Cart is empty", "You cannot proceed with an empty cart.");
              }
        }}
        style={{
          backgroundColor: "#FFC72C",
          padding: 10,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
        <Text>Proceed to Buy ({cart.length}) items</Text> 
      </Pressable>

      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 1,
          marginTop: 16,
        }}
      />

<View style={{ marginHorizontal: 10 }}>
        {cart?.map((item, index) => (
          <View
            style={{
              backgroundColor: "white",
              marginVertical: 10,
              borderBottomColor: "#F0F0F0",
              borderWidth: 2,
              borderLeftWidth: 0,
              borderTopWidth: 0,
              borderRightWidth: 0,
            }}
            key={index}
          >
            <Pressable
              style={{
                marginVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Image
                  style={{ width: 140, height: 140, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />
              </View>

              <View>
                <Text numberOfLines={3} style={{ width: 150, marginTop: 10 }}>
                  {item?.title}
                </Text>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
                >
                  {item?.price}
                </Text>
                <Image
                  style={{ width: 30, height: 30, resizeMode: "contain" }}
                  source={{
                    uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                  }}
                />
                <Text style={{ color: "green" }}>In Stock</Text>
                {/* <Text style={{ fontWeight: "500", marginTop: 6 }}>
                  {item?.rating?.rate} ratings
                </Text> */}
              </View>
            </Pressable>

            <Pressable
              style={{
                marginTop: 15,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 7,
                }}
              >
                {item?.quantity > 1 ? (
                  <Pressable
                    onPress={() => decreaseQuantity(item)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <AntDesign name="minus" size={24} color="black" />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => deleteItem(item)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <AntDesign name="delete" size={24} color="black" />
                  </Pressable>
                )}

                <Pressable
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 18,
                    paddingVertical: 6,
                  }}
                >
                  <Text>{item?.quantity}</Text>
                </Pressable>

                <Pressable
                  onPress={() => increaseQuantity(item)}
                  style={{
                    backgroundColor: "#D8D8D8",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Feather name="plus" size={24} color="black" />
                </Pressable>
              </View>
              <Pressable
                onPress={() => deleteItem(item)}
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>Delete</Text>
              </Pressable>
            </Pressable>

            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 15,
              }}
            >
              {/* <Pressable
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>Save For Later</Text>
              </Pressable> */}

              {/* <Pressable
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>See More Like this</Text>
              </Pressable> */}
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollViewforMe>
  );
};

export default CartScreen;

const styles = StyleSheet.create({});
