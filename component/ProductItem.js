import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addToCart } from "../redux/CartReducer";
import { useSelector } from "react-redux";

const ProductItem = ({ item, index }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 6000);
  };
  return (
    <TouchableOpacity
      key={`product-${index}`}
      style={{ marginHorizontal: 20, marginVertical: 25 }}
    >
      <Image
        style={{ width: 150, height: 150, resizeMode: "contain" }}
        source={{ uri: item?.image }}
      ></Image>

      <Text numberOfLines={1} style={{ width: 150, marginTop: 10 }}>
        {item?.title}
      </Text>

      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item?.price}฿</Text>
        <Text style={{ color: "#FFC72C" }}>{item?.rating?.rate} ratings</Text>
      </View>

      <TouchableOpacity
        onPress={() => addItemToCart(item)}
        style={{
          backgroundColor: "#FFC72C",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
        {addedToCart ? (
          <View>
            <Text>Added to Cart</Text>
          </View>
        ) : (
          <Text>Add to Cart</Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({});
