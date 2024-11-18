import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import StackNavigator from "./navigation/StackNavigator";
import { Provider } from "react-redux";
import store from "./store";
import { ModalPortal } from "react-native-modals";
import { UserContext } from "./UserContext";
import { AddressProvider } from "./AddressContext";

export default function App() {
  return (
    <>
    <AddressProvider>
      <Provider store={store}>
           <UserContext>
          <StackNavigator />
          <ModalPortal />
        </UserContext>
      </Provider>
    </AddressProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
