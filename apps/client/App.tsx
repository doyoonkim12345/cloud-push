import { View, Image } from "react-native";
import React from "react";
import { MethodsTestScreen } from "./screens/MethodsTestScreen";
import PagerView from "react-native-pager-view";
import ConstantsTestScreen from "./screens/ConstantsTestScreen";
import { HooksTestScreen } from "./screens/HooksTestScreen";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
	// const appState = useRef(AppState.currentState);

	// // foreground 전환 시 업데이트 확인
	// const checkUpdateOnForeground = useCallback(async () => {
	// 	try {
	// 		const update = await Updates.checkForUpdateAsync();
	// 		if (update.isAvailable) {
	// 			await Updates.fetchUpdateAsync();
	// 			await Updates.reloadAsync(); // 여기서 앱이 reload됨
	// 		} else {
	// 		}
	// 	} catch (e) {
	// 		console.warn("Error checking updates", e);
	// 	}
	// }, []);

	// useEffect(() => {
	// 	const subscription = AppState.addEventListener("change", (nextState) => {
	// 		if (
	// 			appState.current.match(/inactive|background/) &&
	// 			nextState === "active"
	// 		) {
	// 			checkUpdateOnForeground();
	// 		}
	// 		appState.current = nextState;
	// 	});

	// 	return () => subscription.remove();
	// }, []);

	return (
		<View style={{ flex: 1 }}>
			<PagerView style={{ flex: 1 }} initialPage={0}>
				<HomeScreen />
				<ConstantsTestScreen />
				<HooksTestScreen />
				<MethodsTestScreen />
			</PagerView>
		</View>
	);
}
