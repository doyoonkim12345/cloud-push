import * as Updates from "expo-updates";
import { useEffect } from "react";
import {
	Alert,
	ScrollView,
	Button,
	View,
	ActivityIndicator,
	Text,
} from "react-native";

export function HooksTestScreen() {
	const {
		currentlyRunning,
		availableUpdate,
		downloadedUpdate,
		isChecking,
		isDownloading,
		lastCheckForUpdateTimeSinceRestart,
		checkError,
		downloadError,
		initializationError,
	} = Updates.useUpdates();

	/* 새 업데이트 내려받히면 자동 적용 */
	useEffect(() => {
		if (downloadedUpdate) {
			Updates.reloadAsync();
		}
	}, [downloadedUpdate]);

	const onCheckForUpdate = async () => {
		try {
			await Updates.checkForUpdateAsync();
		} catch (err: any) {
			Alert.alert("업데이트 확인 오류", err.message);
		}
	};

	const onFetchUpdate = async () => {
		try {
			const res = await Updates.fetchUpdateAsync();
			Alert.alert("다운로드 완료", JSON.stringify(res, null, 2));
		} catch (err: any) {
			Alert.alert("다운로드 오류", err.message);
		}
	};

	const onReload = () => Updates.reloadAsync();

	return (
		<ScrollView style={{ padding: 20 }}>
			<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
				useUpdates() 테스트 (SDK 52)
			</Text>

			{/* 현재 실행 중인 정보 */}
			<Section title="현재 실행 중인 빌드">
				<KeyValue k="채널" v={currentlyRunning?.channel} />
				<KeyValue k="런타임 버전" v={currentlyRunning?.runtimeVersion} />
				<KeyValue k="업데이트 ID" v={currentlyRunning?.updateId} />
				<KeyValue
					k="내장 번들 여부"
					v={currentlyRunning?.isEmbeddedLaunch ? "yes" : "no"}
				/>
			</Section>

			{/* 서버에 새 업데이트 발견 */}
			{availableUpdate && (
				<Section title="새 업데이트 발견">
					<KeyValue k="업데이트 ID" v={availableUpdate.updateId} />
					<KeyValue
						k="생성 시각"
						v={availableUpdate.createdAt?.toLocaleString()}
					/>
					<Button
						title={isDownloading ? "다운로드 중…" : "업데이트 다운로드"}
						onPress={onFetchUpdate}
						disabled={isDownloading}
					/>
				</Section>
			)}

			{/* 상태 & 오류 */}
			<Section title="상태 / 오류">
				<KeyValue
					k="마지막 체크"
					v={
						lastCheckForUpdateTimeSinceRestart
							? lastCheckForUpdateTimeSinceRestart.toLocaleTimeString()
							: "—"
					}
				/>
				{isChecking && <Status label="서버 확인 중…" />}
				{checkError && (
					<Status label={`체크 오류: ${checkError.message}`} err />
				)}
				{downloadError && (
					<Status label={`다운로드 오류: ${downloadError.message}`} err />
				)}
				{initializationError && (
					<Status label={`초기화 오류: ${initializationError.message}`} err />
				)}
			</Section>

			{/* 수동 트리거 버튼 */}
			<View style={{ marginVertical: 12 }}>
				<Button
					title={isChecking ? "확인 중…" : "업데이트 확인"}
					onPress={onCheckForUpdate}
					disabled={isChecking}
				/>
				<Button title="앱 리로드" onPress={onReload} />
			</View>

			{(isChecking || isDownloading) && (
				<View style={{ marginTop: 16, alignItems: "center" }}>
					<ActivityIndicator size="large" />
				</View>
			)}
		</ScrollView>
	);
}

/* ────────── 헬퍼 컴포넌트 ────────── */

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<View style={{ marginBottom: 24 }}>
			<Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
				{title}
			</Text>
			{children}
		</View>
	);
}

function KeyValue({ k, v }: { k: string; v: string | undefined }) {
	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				marginBottom: 8,
			}}
		>
			<Text style={{ fontWeight: "500" }}>{k}</Text>
			<Text
				style={{
					color: "gray",
				}}
			>
				{v ?? "—"}
			</Text>
		</View>
	);
}

function Status({ label, err }: { label: string; err?: boolean }) {
	return (
		<Text style={{ marginTop: 4, color: err ? "red" : "gray" }}>{label}</Text>
	);
}
