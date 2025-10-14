import path from 'node:path'
import os from 'node:os'
import { readFile } from 'node:fs/promises'
/** 
 * ~/.expo/state.json 에 저장된 전체 구조 
 */
export interface ExpoStateJson {
    /** Expo CLI 인스턴스 고유 ID */
    uuid: string;

    /** 인증 관련 정보 */
    auth: ExpoAuth;

    /** (선택) 코드 서명용 개발자 키 ID */
    developmentCodeSigningId?: string;

    /** (선택) Analytics 장치 식별자 */
    analyticsDeviceId?: string;
}

/** auth 필드 하위 구조 */
export interface ExpoAuth {
    /** 
     * 세션 토큰 문자열 (JSON 직렬화된 형태)
     * 파싱 후 SessionSecretPayload 타입을 얻을 수 있다.
     */
    sessionSecret: string;

    /** Expo 사용자 ID */
    userId: string;

    /** Expo 사용자명 */
    username: string;

    /** 현재 로그인 방식 (예: "Username-Password-Authentication") */
    currentConnection: string;
}

/** sessionSecret 문자열(JSON)을 parse 했을 때 나오는 객체 구조 */
export interface SessionSecretPayload {
    /** 세션 고유 ID */
    id: string;

    /** 버전 (항상 1) */
    version: number;

    /** 만료 시각 (Unix ms) */
    expires_at: number;
}

export const getExpoStateJson = async (): Promise<ExpoStateJson | undefined> => {
    const statePath = path.join(os.homedir(), ".expo", "state.json");
    const raw = await readFile(statePath, "utf8");

    const parsed = JSON.parse(raw) as ExpoStateJson | undefined

    return parsed
}