
import { View } from "react-native";
import React from "react";
import { MethodsTestScreen } from "./screens/MethodsTestScreen";
import PagerView from "react-native-pager-view";
import ConstantsTestScreen from "./screens/ConstantsTestScreen";
import { HooksTestScreen } from "./screens/HooksTestScreen";

export default function App() {

  return <View style={{flex : 1}}>
    <PagerView style={{flex : 1}} initialPage={0}>
      <ConstantsTestScreen />
      <HooksTestScreen />
      <MethodsTestScreen />
    </PagerView>
  </View>


}
