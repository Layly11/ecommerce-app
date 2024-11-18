import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useLayoutEffect, useEffect, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScrollViewforMe from "../component/ScrollView";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { cleanCart } from "../redux/CartReducer"; 
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
const ProfileScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#00CED1",
      },
      headerLeft: () => (
        <Image
          style={{ width: 140, height: 120, resizeMode: "contain" }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c518.png",
          }}
        />
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginRight: 12,
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />

          <AntDesign name="search1" size={24} color="black" />
        </View>
      ),
    });
  }, []);
  const [user, setUser] = useState();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Assume the "users" collection stores user profiles
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          console.log("No such user!");
        }
      } catch (error) {
        console.log("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [userId]);
  console.log("user : ", userId)
  const logout = async() => {
    dispatch(cleanCart()); // Dispatch the action to clean the cart
    await AsyncStorage.removeItem("cart");
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("auth token cleared");
    navigation.replace("Login");
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Query the "orders" collection where the userId matches
        const q = query(
          collection(db, "orders"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);

        // Map the documents to order objects
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };
    if (userId) fetchOrders(); // Fetch orders only if userId is available
  }, [userId]);
  console.log("orders", orders);
  return (
    <ScrollViewforMe style={{ padding: 10, flex: 1, backgroundColor: "white" }}>
    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
      Welcome {user?.name}
    </Text>

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 12,
      }}
    >


      {/* <Pressable
        style={{
          padding: 10,
          backgroundColor: "#E0E0E0",
          borderRadius: 25,
          flex: 1,
        }}
      >
        <Text style={{ textAlign: "center" }}>Your Account</Text>
      </Pressable> */}
    </View>

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 12,
      }}
    >
      {/* <Pressable
        style={{
          padding: 10,
          backgroundColor: "#E0E0E0",
          borderRadius: 25,
          flex:1
        }}
      >
        <Text style={{ textAlign: "center" }}>Buy Again</Text>
      </Pressable> */}

      <Pressable
        onPress={logout}
        style={{
          padding: 10,
          backgroundColor: "#E0E0E0",
          borderRadius: 25,
          flex: 1,
        }}
      >
        <Text style={{ textAlign: "center" }}>Logout</Text>
      </Pressable>

      
    </View>
    <View
        style={{
          marginTop: 20,
          padding: 10,
          borderRadius: 25,
          flex: 1,
        }}
      >
        <Text style={{ textAlign: "center", fontSize:20, fontWeight: "800" }}>Your orders</Text>
      </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
  {loading ? (
    <Text>Loading...</Text>
  ) : orders.length > 0 ? (
    orders.map((order) => (
      <Pressable
        style={{
          marginTop: 20,
          padding: 15,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#d0d0d0",
          marginHorizontal: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
        key={order.id} // Use 'order.id' instead of 'order._id
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 19, fontWeight: "700" }}>Order Id :</Text>
          <Text style={{ marginTop: 5, marginLeft: 4 }}>{order.id}</Text>
        </View>

        <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
          {order.cartItems.map((product, index) => (
            <TouchableOpacity style={{ marginVertical: 10 }} key={index}>
              <Image
                source={{ uri: product.image }}
                style={{ width: 100, height: 100, resizeMode: "contain" }}
              />
              <Text numberOfLines={3} style={{ width: 150, marginTop: 10 }}>{product.description}</Text>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>Quantity: {product.quantity}</Text>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>{product.price * product.quantity}฿</Text>
            </TouchableOpacity>
          ))}
          <Text style={{ marginVertical: 20, fontSize: 19, fontWeight: "700" }}>
            Total Price: {order.totalPrice}
          </Text>
        </View>
      </Pressable>
    ))
  ) : (
    <Text>No orders found</Text>
  )}
</ScrollView>

  </ScrollViewforMe>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})