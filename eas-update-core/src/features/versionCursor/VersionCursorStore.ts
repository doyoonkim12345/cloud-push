import { Environment, Platform } from "@/types";
import {
  SerializedVersionCursor,
  VersionCursor,
  VersionCursorData,
} from "./types";

// 필터 타입 정의
export type FilterCriteria = {
  runtimeVersion?: string;
  platforms?: Platform[];
  requireAllPlatforms?: boolean;
  environment?: Environment;
  dateRange?: { from: number; to: number };
};

// 정렬 타입 정의
export type SortOptions = {
  field: "createdAt" | "runtimeVersion";
  order: "asc" | "desc";
};

// 검색 결과 클래스 (체이닝을 위한 결과 래퍼)
export class SearchResult {
  constructor(private data: VersionCursor) {}

  // 정렬 메서드
  sort(options: SortOptions): Array<[string, VersionCursorData]> {
    const entries = Object.entries(this.data);

    if (options.field === "createdAt") {
      return entries.sort((a, b) => {
        const dateA = a[1].createdAt;
        const dateB = b[1].createdAt;
        return options.order === "asc" ? dateA - dateB : dateB - dateA;
      });
    } else if (options.field === "runtimeVersion") {
      return entries.sort((a, b) => {
        const versionA = a[1].runtimeVersion;
        const versionB = b[1].runtimeVersion;
        return options.order === "asc"
          ? versionA.localeCompare(versionB)
          : versionB.localeCompare(versionA);
      });
    }

    // 기본 정렬 (ID순)
    return entries;
  }

  // 원본 데이터 가져오기
  getData(): VersionCursor {
    return this.data;
  }

  // 배열 형태로 변환
  toArray(): Array<[string, VersionCursorData]> {
    return Object.entries(this.data);
  }

  // SearchResult를 배열처럼 사용할 수 있도록 iterator 구현
  [Symbol.iterator]() {
    return Object.entries(this.data)[Symbol.iterator]();
  }
}

export default class VersionCursorStore {
  // 메인 데이터 저장소
  private data: VersionCursor = {};

  // runtimeVersion 인덱스
  private runtimeVersionIndex = new Map<string, Set<string>>();

  // platform 인덱스 (각 플랫폼별로 bundleId 집합)
  private platformIndex = new Map<Platform, Set<string>>();

  // createdAt 인덱스 (정렬 지원)
  private createdAtIndex = new Map<number, Set<string>>();
  private sortedCreatedAtValues: number[] = [];

  // environment 인덱스
  private environmentIndex = new Map<Environment, Set<string>>();

  // 데이터 추가
  addVersion(bundleId: string, versionData: VersionCursorData): void {
    // 기존 데이터가 있으면 인덱스에서 제거
    if (this.data[bundleId]) {
      this.removeFromIndexes(bundleId);
    }

    // 데이터 저장
    this.data[bundleId] = versionData;

    // 인덱스 업데이트
    this.addToIndexes(bundleId, versionData);
  }

  // 데이터 제거
  removeVersion(bundleId: string): boolean {
    if (!this.data[bundleId]) return false;

    this.removeFromIndexes(bundleId);
    delete this.data[bundleId];
    return true;
  }

  // 인덱스에 추가하는 헬퍼 메서드
  private addToIndexes(
    bundleId: string,
    versionData: {
      runtimeVersion: string;
      platforms: Platform[];
      createdAt: number;
      environment: Environment;
      gitHash: string;
    }
  ): void {
    // 1. runtimeVersion 인덱스 업데이트
    if (!this.runtimeVersionIndex.has(versionData.runtimeVersion)) {
      this.runtimeVersionIndex.set(
        versionData.runtimeVersion,
        new Set<string>()
      );
    }
    this.runtimeVersionIndex.get(versionData.runtimeVersion)!.add(bundleId);

    // 2. platform 인덱스 업데이트
    for (const platform of versionData.platforms) {
      if (!this.platformIndex.has(platform)) {
        this.platformIndex.set(platform, new Set<string>());
      }
      this.platformIndex.get(platform)!.add(bundleId);
    }

    // 3. createdAt 인덱스 업데이트
    if (!this.createdAtIndex.has(versionData.createdAt)) {
      this.createdAtIndex.set(versionData.createdAt, new Set<string>());
      // 정렬된 배열에 추가하고 정렬 유지
      this.sortedCreatedAtValues.push(versionData.createdAt);
      this.sortedCreatedAtValues.sort((a, b) => a - b);
    }
    this.createdAtIndex.get(versionData.createdAt)!.add(bundleId);

    // 4. environment 인덱스 업데이트
    if (!this.environmentIndex.has(versionData.environment)) {
      this.environmentIndex.set(versionData.environment, new Set<string>());
    }
    this.environmentIndex.get(versionData.environment)!.add(bundleId);
  }

  // 인덱스에서 제거하는 헬퍼 메서드
  private removeFromIndexes(bundleId: string): void {
    const versionData = this.data[bundleId];

    // 1. runtimeVersion 인덱스에서 제거
    this.runtimeVersionIndex.get(versionData.runtimeVersion)?.delete(bundleId);

    // 2. platform 인덱스에서 제거
    for (const platform of versionData.platforms) {
      this.platformIndex.get(platform)?.delete(bundleId);
    }

    // 3. createdAt 인덱스에서 제거
    const createdAtSet = this.createdAtIndex.get(versionData.createdAt);
    if (createdAtSet) {
      createdAtSet.delete(bundleId);
      if (createdAtSet.size === 0) {
        this.createdAtIndex.delete(versionData.createdAt);
        // 정렬된 배열에서도 제거
        this.sortedCreatedAtValues = this.sortedCreatedAtValues.filter(
          (date) => date !== versionData.createdAt
        );
      }
    }

    // 4. environment 인덱스에서 제거
    this.environmentIndex.get(versionData.environment)?.delete(bundleId);
  }

  // ---- 범용 검색 메서드 ----

  // 필터링 메서드 - 체이닝 지원을 위해 SearchResult 객체 반환
  find(criteria: FilterCriteria = {}): SearchResult {
    // 초기 결과는 모든 번들 ID 집합
    let resultBundleIds: Set<string> | null = null;

    // 런타임 버전 필터 적용
    if (criteria.runtimeVersion) {
      const versionBundleIds = this.runtimeVersionIndex.get(
        criteria.runtimeVersion
      );
      resultBundleIds = this.updateResultSet(resultBundleIds, versionBundleIds);
      if (!resultBundleIds || resultBundleIds.size === 0)
        return new SearchResult({});
    }

    // 플랫폼 필터 적용
    if (criteria.platforms && criteria.platforms.length > 0) {
      if (criteria.requireAllPlatforms) {
        // 모든 플랫폼을 지원해야 하는 경우 (AND 조건)
        for (const platform of criteria.platforms) {
          const platformBundleIds = this.platformIndex.get(platform);
          resultBundleIds = this.updateResultSet(
            resultBundleIds,
            platformBundleIds
          );
          if (!resultBundleIds || resultBundleIds.size === 0)
            return new SearchResult({});
        }
      } else {
        // 어느 하나의 플랫폼이라도 지원하면 되는 경우 (OR 조건)
        const platformBundleIds = new Set<string>();
        for (const platform of criteria.platforms) {
          const ids = this.platformIndex.get(platform);
          if (ids) {
            for (const id of ids) {
              platformBundleIds.add(id);
            }
          }
        }
        resultBundleIds = this.updateResultSet(
          resultBundleIds,
          platformBundleIds
        );
        if (!resultBundleIds || resultBundleIds.size === 0)
          return new SearchResult({});
      }
    }

    // 환경 필터 적용
    if (criteria.environment) {
      const envBundleIds = this.environmentIndex.get(criteria.environment);
      resultBundleIds = this.updateResultSet(resultBundleIds, envBundleIds);
      if (!resultBundleIds || resultBundleIds.size === 0)
        return new SearchResult({});
    }

    // 날짜 범위 필터 적용
    if (criteria.dateRange) {
      const { from, to } = criteria.dateRange;
      const dateBundleIds = new Set<string>();

      // 정렬된 createdAt 값을 이용하여 범위 검색 최적화
      for (const date of this.sortedCreatedAtValues) {
        if (date < from) continue;
        if (date > to) break;

        const ids = this.createdAtIndex.get(date);
        if (ids) {
          for (const id of ids) {
            dateBundleIds.add(id);
          }
        }
      }

      resultBundleIds = this.updateResultSet(resultBundleIds, dateBundleIds);
      if (!resultBundleIds || resultBundleIds.size === 0)
        return new SearchResult({});
    }

    // 필터링된 결과가 없으면 전체 데이터 반환
    if (!resultBundleIds) {
      return new SearchResult({ ...this.data });
    }

    // 결과 구성
    const result: VersionCursor = {};
    for (const bundleId of resultBundleIds) {
      result[bundleId] = this.data[bundleId];
    }

    return new SearchResult(result);
  }

  // 결과 집합 업데이트 헬퍼 메서드
  private updateResultSet(
    currentSet: Set<string> | null,
    newSet: Set<string> | undefined
  ): Set<string> | null {
    if (!newSet) return new Set<string>(); // 새 집합이 없으면 빈 결과

    if (!currentSet) {
      // 첫 필터인 경우 새 집합을 그대로 사용
      return new Set(newSet);
    } else {
      // 교집합 계산 (AND 조건)
      const intersection = new Set<string>();
      for (const id of currentSet) {
        if (newSet.has(id)) {
          intersection.add(id);
        }
      }
      return intersection;
    }
  }

  // ---- 직렬화 및 역직렬화 메서드 ----

  // 직렬화: 인스턴스를 SerializedVersionCursor 객체로 변환
  serialize(): SerializedVersionCursor {
    // 각 Map과 Set을 직렬화 가능한 객체로 변환
    return {
      data: this.data,

      // Map<string, Set<string>> 변환
      runtimeVersionIndex: Array.from(this.runtimeVersionIndex.entries()).map(
        ([key, value]) => [key, Array.from(value)] as [string, string[]]
      ),

      // Map<Platform, Set<string>> 변환
      platformIndex: Array.from(this.platformIndex.entries()).map(
        ([key, value]) => [key, Array.from(value)] as [Platform, string[]]
      ),

      // Map<number, Set<string>> 변환
      createdAtIndex: Array.from(this.createdAtIndex.entries()).map(
        ([key, value]) => [key, Array.from(value)] as [number, string[]]
      ),

      // 정렬된 배열
      sortedCreatedAtValues: this.sortedCreatedAtValues,

      // Map<Environment, Set<string>> 변환
      environmentIndex: Array.from(this.environmentIndex.entries()).map(
        ([key, value]) => [key, Array.from(value)] as [Environment, string[]]
      ),
    };
  }

  // 직렬화된 객체를 JSON 문자열로 변환
  toJSON(): string {
    return JSON.stringify(this.serialize());
  }

  // 역직렬화: SerializedVersionCursor 객체로부터 인스턴스 복원
  static deserialize(serialized: SerializedVersionCursor): VersionCursorStore {
    const store = new VersionCursorStore();

    // 데이터 복원
    store.data = serialized.data;

    // runtimeVersionIndex 복원
    store.runtimeVersionIndex = new Map();
    for (const entry of serialized.runtimeVersionIndex) {
      if (Array.isArray(entry) && entry.length === 2) {
        const [key, values] = entry;
        if (typeof key === "string" && Array.isArray(values)) {
          store.runtimeVersionIndex.set(key, new Set(values));
        }
      }
    }

    // platformIndex 복원
    store.platformIndex = new Map();
    for (const entry of serialized.platformIndex) {
      if (Array.isArray(entry) && entry.length === 2) {
        const [key, values] = entry;
        if (Array.isArray(values)) {
          store.platformIndex.set(key as Platform, new Set(values));
        }
      }
    }

    // createdAtIndex 복원
    store.createdAtIndex = new Map();
    for (const entry of serialized.createdAtIndex) {
      if (Array.isArray(entry) && entry.length === 2) {
        const [key, values] = entry;
        if (Array.isArray(values)) {
          const numericKey =
            typeof key === "string" ? Number(key) : (key as number);
          store.createdAtIndex.set(numericKey, new Set(values));
        }
      }
    }

    // 정렬된 배열 복원
    store.sortedCreatedAtValues = Array.isArray(
      serialized.sortedCreatedAtValues
    )
      ? serialized.sortedCreatedAtValues
      : [];

    // environmentIndex 복원
    store.environmentIndex = new Map();
    for (const entry of serialized.environmentIndex) {
      if (Array.isArray(entry) && entry.length === 2) {
        const [key, values] = entry;
        if (Array.isArray(values)) {
          store.environmentIndex.set(key as Environment, new Set(values));
        }
      }
    }

    return store;
  }

  // JSON 문자열로부터 인스턴스 복원하는 정적 메서드
  static async fromJSON(file: File): Promise<VersionCursorStore> {
    const json = await file.text();
    return VersionCursorStore.deserialize(JSON.parse(json));
  }

  // 또는 기존 인스턴스에 로드하는 메서드
  loadFromSerialized(serialized: SerializedVersionCursor) {
    // 데이터 복원
    this.data = serialized.data;

    // runtimeVersionIndex 복원
    this.runtimeVersionIndex = new Map();
    for (const entry of serialized.runtimeVersionIndex) {
      if (Array.isArray(entry) && entry.length === 2) {
        const [key, values] = entry;
        if (typeof key === "string" && Array.isArray(values)) {
          this.runtimeVersionIndex.set(key, new Set(values));
        }
      }
    }

    // platformIndex 복원
    this.platformIndex = new Map();
    for (const entry of serialized.platformIndex) {
      if (Array.isArray(entry) && entry.length === 2) {
        const [key, values] = entry;
        if (Array.isArray(values)) {
          this.platformIndex.set(key as Platform, new Set(values));
        }
      }
    }

    // createdAtIndex 복원
    this.createdAtIndex = new Map();
    for (const entry of serialized.createdAtIndex) {
      if (Array.isArray(entry) && entry.length === 2) {
        const [key, values] = entry;
        if (Array.isArray(values)) {
          const numericKey =
            typeof key === "string" ? Number(key) : (key as number);
          this.createdAtIndex.set(numericKey, new Set(values));
        }
      }
    }

    // 정렬된 배열 복원
    this.sortedCreatedAtValues = Array.isArray(serialized.sortedCreatedAtValues)
      ? serialized.sortedCreatedAtValues
      : [];

    // environmentIndex 복원
    this.environmentIndex = new Map();
    for (const entry of serialized.environmentIndex) {
      if (Array.isArray(entry) && entry.length === 2) {
        const [key, values] = entry;
        if (Array.isArray(values)) {
          this.environmentIndex.set(key as Environment, new Set(values));
        }
      }
    }
  }

  // JSON 문자열로부터 현재 인스턴스에 로드
  async loadFromJSON(file: File) {
    const json = await file.text();
    this.loadFromSerialized(JSON.parse(json));
  }
}
