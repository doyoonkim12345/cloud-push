var _computedKey;
_computedKey = Symbol.iterator;
class SearchResult {
    data;
    constructor(data){
        this.data = data;
    }
    sort(options) {
        const entries = Object.entries(this.data);
        if ("createdAt" === options.field) return entries.sort((a, b)=>{
            const dateA = a[1].createdAt;
            const dateB = b[1].createdAt;
            return "asc" === options.order ? dateA - dateB : dateB - dateA;
        });
        if ("runtimeVersion" === options.field) return entries.sort((a, b)=>{
            const versionA = a[1].runtimeVersion;
            const versionB = b[1].runtimeVersion;
            return "asc" === options.order ? versionA.localeCompare(versionB) : versionB.localeCompare(versionA);
        });
        return entries;
    }
    getData() {
        return this.data;
    }
    toArray() {
        return Object.entries(this.data);
    }
    [_computedKey]() {
        return Object.entries(this.data)[Symbol.iterator]();
    }
}
class VersionCursorStore {
    data = {};
    runtimeVersionIndex = new Map();
    platformIndex = new Map();
    createdAtIndex = new Map();
    sortedCreatedAtValues = [];
    environmentIndex = new Map();
    addVersion(bundleId, versionData) {
        if (this.data[bundleId]) this.removeFromIndexes(bundleId);
        this.data[bundleId] = versionData;
        this.addToIndexes(bundleId, versionData);
    }
    removeVersion(bundleId) {
        if (!this.data[bundleId]) return false;
        this.removeFromIndexes(bundleId);
        delete this.data[bundleId];
        return true;
    }
    addToIndexes(bundleId, versionData) {
        if (!this.runtimeVersionIndex.has(versionData.runtimeVersion)) this.runtimeVersionIndex.set(versionData.runtimeVersion, new Set());
        this.runtimeVersionIndex.get(versionData.runtimeVersion).add(bundleId);
        for (const platform of versionData.platforms){
            if (!this.platformIndex.has(platform)) this.platformIndex.set(platform, new Set());
            this.platformIndex.get(platform).add(bundleId);
        }
        if (!this.createdAtIndex.has(versionData.createdAt)) {
            this.createdAtIndex.set(versionData.createdAt, new Set());
            this.sortedCreatedAtValues.push(versionData.createdAt);
            this.sortedCreatedAtValues.sort((a, b)=>a - b);
        }
        this.createdAtIndex.get(versionData.createdAt).add(bundleId);
        if (!this.environmentIndex.has(versionData.environment)) this.environmentIndex.set(versionData.environment, new Set());
        this.environmentIndex.get(versionData.environment).add(bundleId);
    }
    removeFromIndexes(bundleId) {
        const versionData = this.data[bundleId];
        this.runtimeVersionIndex.get(versionData.runtimeVersion)?.delete(bundleId);
        for (const platform of versionData.platforms)this.platformIndex.get(platform)?.delete(bundleId);
        const createdAtSet = this.createdAtIndex.get(versionData.createdAt);
        if (createdAtSet) {
            createdAtSet.delete(bundleId);
            if (0 === createdAtSet.size) {
                this.createdAtIndex.delete(versionData.createdAt);
                this.sortedCreatedAtValues = this.sortedCreatedAtValues.filter((date)=>date !== versionData.createdAt);
            }
        }
        this.environmentIndex.get(versionData.environment)?.delete(bundleId);
    }
    find(criteria = {}) {
        let resultBundleIds = null;
        if (criteria.runtimeVersion) {
            const versionBundleIds = this.runtimeVersionIndex.get(criteria.runtimeVersion);
            resultBundleIds = this.updateResultSet(resultBundleIds, versionBundleIds);
            if (!resultBundleIds || 0 === resultBundleIds.size) return new SearchResult({});
        }
        if (criteria.platforms && criteria.platforms.length > 0) {
            if (criteria.requireAllPlatforms) for (const platform of criteria.platforms){
                const platformBundleIds = this.platformIndex.get(platform);
                resultBundleIds = this.updateResultSet(resultBundleIds, platformBundleIds);
                if (!resultBundleIds || 0 === resultBundleIds.size) return new SearchResult({});
            }
            else {
                const platformBundleIds = new Set();
                for (const platform of criteria.platforms){
                    const ids = this.platformIndex.get(platform);
                    if (ids) for (const id of ids)platformBundleIds.add(id);
                }
                resultBundleIds = this.updateResultSet(resultBundleIds, platformBundleIds);
                if (!resultBundleIds || 0 === resultBundleIds.size) return new SearchResult({});
            }
        }
        if (criteria.environment) {
            const envBundleIds = this.environmentIndex.get(criteria.environment);
            resultBundleIds = this.updateResultSet(resultBundleIds, envBundleIds);
            if (!resultBundleIds || 0 === resultBundleIds.size) return new SearchResult({});
        }
        if (criteria.dateRange) {
            const { from, to } = criteria.dateRange;
            const dateBundleIds = new Set();
            for (const date of this.sortedCreatedAtValues){
                if (date < from) continue;
                if (date > to) break;
                const ids = this.createdAtIndex.get(date);
                if (ids) for (const id of ids)dateBundleIds.add(id);
            }
            resultBundleIds = this.updateResultSet(resultBundleIds, dateBundleIds);
            if (!resultBundleIds || 0 === resultBundleIds.size) return new SearchResult({});
        }
        if (!resultBundleIds) return new SearchResult({
            ...this.data
        });
        const result = {};
        for (const bundleId of resultBundleIds)result[bundleId] = this.data[bundleId];
        return new SearchResult(result);
    }
    updateResultSet(currentSet, newSet) {
        if (!newSet) return new Set();
        if (!currentSet) return new Set(newSet);
        {
            const intersection = new Set();
            for (const id of currentSet)if (newSet.has(id)) intersection.add(id);
            return intersection;
        }
    }
    serialize() {
        return {
            data: this.data,
            runtimeVersionIndex: Array.from(this.runtimeVersionIndex.entries()).map(([key, value])=>[
                    key,
                    Array.from(value)
                ]),
            platformIndex: Array.from(this.platformIndex.entries()).map(([key, value])=>[
                    key,
                    Array.from(value)
                ]),
            createdAtIndex: Array.from(this.createdAtIndex.entries()).map(([key, value])=>[
                    key,
                    Array.from(value)
                ]),
            sortedCreatedAtValues: this.sortedCreatedAtValues,
            environmentIndex: Array.from(this.environmentIndex.entries()).map(([key, value])=>[
                    key,
                    Array.from(value)
                ])
        };
    }
    toJSON() {
        return JSON.stringify(this.serialize());
    }
    static deserialize(serialized) {
        const store = new VersionCursorStore();
        store.data = serialized.data;
        store.runtimeVersionIndex = new Map();
        for (const entry of serialized.runtimeVersionIndex)if (Array.isArray(entry) && 2 === entry.length) {
            const [key, values] = entry;
            if ("string" == typeof key && Array.isArray(values)) store.runtimeVersionIndex.set(key, new Set(values));
        }
        store.platformIndex = new Map();
        for (const entry of serialized.platformIndex)if (Array.isArray(entry) && 2 === entry.length) {
            const [key, values] = entry;
            if (Array.isArray(values)) store.platformIndex.set(key, new Set(values));
        }
        store.createdAtIndex = new Map();
        for (const entry of serialized.createdAtIndex)if (Array.isArray(entry) && 2 === entry.length) {
            const [key, values] = entry;
            if (Array.isArray(values)) {
                const numericKey = "string" == typeof key ? Number(key) : key;
                store.createdAtIndex.set(numericKey, new Set(values));
            }
        }
        store.sortedCreatedAtValues = Array.isArray(serialized.sortedCreatedAtValues) ? serialized.sortedCreatedAtValues : [];
        store.environmentIndex = new Map();
        for (const entry of serialized.environmentIndex)if (Array.isArray(entry) && 2 === entry.length) {
            const [key, values] = entry;
            if (Array.isArray(values)) store.environmentIndex.set(key, new Set(values));
        }
        return store;
    }
    static async fromJSON(file) {
        const json = await file.text();
        return VersionCursorStore.deserialize(JSON.parse(json));
    }
    loadFromSerialized(serialized) {
        this.data = serialized.data;
        this.runtimeVersionIndex = new Map();
        for (const entry of serialized.runtimeVersionIndex)if (Array.isArray(entry) && 2 === entry.length) {
            const [key, values] = entry;
            if ("string" == typeof key && Array.isArray(values)) this.runtimeVersionIndex.set(key, new Set(values));
        }
        this.platformIndex = new Map();
        for (const entry of serialized.platformIndex)if (Array.isArray(entry) && 2 === entry.length) {
            const [key, values] = entry;
            if (Array.isArray(values)) this.platformIndex.set(key, new Set(values));
        }
        this.createdAtIndex = new Map();
        for (const entry of serialized.createdAtIndex)if (Array.isArray(entry) && 2 === entry.length) {
            const [key, values] = entry;
            if (Array.isArray(values)) {
                const numericKey = "string" == typeof key ? Number(key) : key;
                this.createdAtIndex.set(numericKey, new Set(values));
            }
        }
        this.sortedCreatedAtValues = Array.isArray(serialized.sortedCreatedAtValues) ? serialized.sortedCreatedAtValues : [];
        this.environmentIndex = new Map();
        for (const entry of serialized.environmentIndex)if (Array.isArray(entry) && 2 === entry.length) {
            const [key, values] = entry;
            if (Array.isArray(values)) this.environmentIndex.set(key, new Set(values));
        }
    }
    async loadFromJSON(file) {
        const json = await file.text();
        this.loadFromSerialized(JSON.parse(json));
    }
}
export { VersionCursorStore };
