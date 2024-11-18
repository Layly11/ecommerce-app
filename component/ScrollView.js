import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
export default function ScrollViewforMe({children, ...props}) {
  return (
    <GestureHandlerRootView>
        <ScrollView {...props}>{children}</ScrollView>
    </GestureHandlerRootView>
  )
}



const styles = StyleSheet.create({})