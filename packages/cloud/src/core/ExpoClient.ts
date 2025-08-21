/**
 * ExpoClient – Expo GraphQL API helper
 * ------------------------------------
 * © 2025 Cloud-Push
 */


const EXPO_GRAPHQL_URL = 'https://api.expo.dev/graphql';

/* ──────────────── Common Types ──────────────── */
export type ExpoAuth = {
  token?: string;
  sessionSecret?: string;
};

export type ExpoChannel = { id: string; name: string };
export type ExpoBranch = { id: string; name: string };

type BranchMappingLogicEntry = { branchId: string; branchMappingLogic: string };
type BranchMapping = { version: number; data: BranchMappingLogicEntry[] };

export type ExpoChannelMapping = { id: string; branchName: string };
export type ExpoBranchMapping = { branchName: string; branchId: string; channelName: string | null };

/* ─────────── Environment-vars Types ─────────── */
export type ExpoEnv = 'DEVELOPMENT' | 'PREVIEW' | 'PRODUCTION';
export type ExpoEnvVarType = 'PLAIN' | 'SECRET' | 'FILE';

export type ExpoEnvVar = {
  id: string;
  name: string;
  type: ExpoEnvVarType;
  value?: string | null;           // PLAIN 이거나 includeSensitive=true 일 때 값
  linkedEnvironments?: ExpoEnv[];  // 대문자 ENUM
  createdAt: string;
  updatedAt: string;
};

export type FetchEnvVarsOptions = {
  environment?: string;        // development | preview | production (대소문자 무관)
  includeSensitive?: boolean;  // SECRET/FILE 실제 값 포함 여부
  filterNames?: string[];      // 특정 변수명만 조회
};

export type RolloutInfo = {
  /** editUpdateChannel 반환 id (rollout id 아님) */
  channelId: string;
  oldBranchId: string;
  newBranchId: string;
  percent: number;
};

/* ────────────────────────────────────────────── */
export class ExpoClient {
  private readonly appId: string;
  private readonly auth: ExpoAuth;

  constructor({ appId, token, sessionSecret }: { appId: string; token?: string; sessionSecret?: string }) {
    this.appId = appId;
    this.auth = { token, sessionSecret };
  }

  /* ───── internal util ───── */
  private async graphqlRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.auth.token) headers.Authorization = `Bearer ${this.auth.token}`;
    if (this.auth.sessionSecret) headers['expo-session'] = this.auth.sessionSecret;

    const res = await fetch(EXPO_GRAPHQL_URL, { method: 'POST', headers, body: JSON.stringify({ query, variables }) });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Expo GraphQL HTTP ${res.status}: ${text}`);
    }

    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Expo GraphQL: invalid JSON response: ${text.slice(0, 500)}`);
    }

    if (Array.isArray(json.errors) && json.errors.length > 0) {
      const msg = json.errors.map((e: any) => e.message).join(' | ');
      const reqId = json.errors[0]?.extensions?.requestId;
      throw new Error(`Expo GraphQL error: ${msg}${reqId ? ` (requestId: ${reqId})` : ''}`);
    }

    if (!('data' in json)) {
      throw new Error(`Expo GraphQL: response has no 'data': ${text.slice(0, 500)}`);
    }

    return json as T;
  }

  /* ───── Environment vars ───── */
  async fetchEnvVars(
    { environment, includeSensitive = false, filterNames }: FetchEnvVarsOptions = {},
  ): Promise<ExpoEnvVar[]> {
    const envEnum = environment?.toUpperCase() as ExpoEnv | undefined;

    const QUERY = includeSensitive
      ? /* GraphQL */ `
          query VarsSensitive($appId: String!, $environment: EnvironmentVariableEnvironment, $filterNames: [String!]) {
            app {
              byId(appId: $appId) {
                environmentVariablesIncludingSensitive(environment: $environment, filterNames: $filterNames) {
                  id name type value linkedEnvironments(appId: $appId) createdAt updatedAt
                }
              }
            }
          }`
      : /* GraphQL */ `
          query Vars($appId: String!, $environment: EnvironmentVariableEnvironment, $filterNames: [String!]) {
            app {
              byId(appId: $appId) {
                environmentVariables(environment: $environment, filterNames: $filterNames) {
                  id name type value linkedEnvironments(appId: $appId) createdAt updatedAt
                }
              }
            }
          }`;

    type Resp = {
      data: {
        app: {
          byId: {
            environmentVariables?: ExpoEnvVar[];
            environmentVariablesIncludingSensitive?: ExpoEnvVar[];
          };
        };
      };
    };

    const { data } = await this.graphqlRequest<Resp>(QUERY, {
      appId: this.appId,
      environment: envEnum ?? null,
      filterNames: filterNames ?? null,
    });

    const vars =
      (includeSensitive ? data.app.byId.environmentVariablesIncludingSensitive
        : data.app.byId.environmentVariables) ?? [];

    // 원 데이터는 대문자 ENUM. 기존 사용처 호환 위해 소문자로 매핑 후 캐스팅 유지.
    return vars.map(v => ({
      ...v,
      linkedEnvironments: v.linkedEnvironments?.map(e => e.toLowerCase()) as unknown as ExpoEnv[] | undefined,
    }));
  }

  /* ───── Channels & Branches ───── */
  async fetchChannels(): Promise<ExpoChannel[]> {
    const q = `query ($appId: String!) { app { byId(appId: $appId) { updateChannels(offset:0,limit:10000){id name} } } }`;
    type R = { data: { app: { byId: { updateChannels: ExpoChannel[] } } } };
    return (await this.graphqlRequest<R>(q, { appId: this.appId })).data.app.byId.updateChannels;
  }

  async fetchBranches(): Promise<ExpoBranch[]> {
    const q = `query ($appId: String!) { app { byId(appId: $appId) { updateBranches(offset:0,limit:10000){id name} } } }`;
    type R = { data: { app: { byId: { updateBranches: ExpoBranch[] } } } };
    return (await this.graphqlRequest<R>(q, { appId: this.appId })).data.app.byId.updateBranches;
  }

  async fetchChannelMapping(channelName: string): Promise<ExpoChannelMapping | null> {
    const q = `
      query ($appId: String!, $channelName: String!) {
        app {
          byId(appId: $appId) {
            updateBranches(offset:0,limit:10000){id name}
            updateChannelByName(name:$channelName){id branchMapping}
          }
        }
      }`;
    type R = {
      data: {
        app: {
          byId: {
            updateBranches: ExpoBranch[];
            updateChannelByName: { id: string; branchMapping: string } | null;
          };
        };
      };
    };

    const { data } = await this.graphqlRequest<R>(q, { appId: this.appId, channelName });

    if (!data.app.byId.updateChannelByName) {
      return null;
    }

    const mapping: BranchMapping = JSON.parse(data.app.byId.updateChannelByName.branchMapping);
    const entry = mapping.data.find(e => {
      try { return JSON.parse(e.branchMappingLogic) === 'true'; } catch { return false; }
    });
    if (!entry) return null;

    const branch = data.app.byId.updateBranches.find(b => b.id === entry.branchId);
    return branch ? { id: data.app.byId.updateChannelByName.id, branchName: branch.name } : null;
  }

  async fetchBranchesMapping(): Promise<ExpoBranchMapping[]> {
    const q = `
      query ($appId: String!) {
        app {
          byId(appId:$appId){
            updateBranches(offset:0,limit:10000){id name}
            updateChannels(offset:0,limit:10000){name branchMapping}
          }
        }
      }`;
    type R = {
      data: {
        app: {
          byId: {
            updateBranches: ExpoBranch[];
            updateChannels: { name: string; branchMapping: string }[];
          };
        };
      };
    };

    const { data } = await this.graphqlRequest<R>(q, { appId: this.appId });
    const idToName = Object.fromEntries(data.app.byId.updateBranches.map(b => [b.id, b.name]));
    const list: ExpoBranchMapping[] = [];

    for (const ch of data.app.byId.updateChannels) {
      const map: BranchMapping = JSON.parse(ch.branchMapping);
      const m = map.data.find(d => { try { return JSON.parse(d.branchMappingLogic) === 'true'; } catch { return false; } });
      if (m) list.push({ branchName: idToName[m.branchId] ?? '(unknown)', branchId: m.branchId, channelName: ch.name });
    }
    for (const b of data.app.byId.updateBranches)
      if (!list.some(m => m.branchId === b.id))
        list.push({ branchName: b.name, branchId: b.id, channelName: null });

    return list;
  }

  async createBranch(branchName: string): Promise<void> {
    const m = `mutation ($appId:ID!,$name:String!){updateBranch{createUpdateBranchForApp(appId:$appId,name:$name){id}}}`;
    await this.graphqlRequest(m, { appId: this.appId, name: branchName });
  }

  async updateChannelBranch(channelId: string, branchId: string): Promise<void> {
    const m = `mutation ($channelId:ID!,$branchMapping:String!){updateChannel{editUpdateChannel(channelId:$channelId,branchMapping:$branchMapping){id}}}`;
    const branchMapping: BranchMapping = { version: 0, data: [{ branchId, branchMappingLogic: 'true' }] };
    await this.graphqlRequest(m, { channelId, branchMapping: JSON.stringify(branchMapping) });
  }

  /** 채널 생성 (선택적으로 특정 브랜치에 고정 매핑) */
  async createChannel(channelName: string, opts?: { branchId?: string }): Promise<ExpoChannel> {
    const { branchId } = opts ?? {};

    const ensureNode = (payload: any) => {
      const node = payload?.data?.updateChannel?.createUpdateChannelForApp;
      if (!node) {
        throw new Error(
          `Failed to create channel '${channelName}'` +
          `${branchId ? ` (branchId=${branchId})` : ''}.` +
          ` Server returned null. Check appId, permissions, or duplicate channel name.`
        );
      }
      return node as ExpoChannel;
    };

    if (branchId) {
      const branchMapping: BranchMapping = {
        version: 0,
        data: [{ branchId, branchMappingLogic: 'true' }],
      };

      const m = `
        mutation ($appId:ID!, $name:String!, $branchMapping:String!) {
          updateChannel {
            createUpdateChannelForApp(appId:$appId, name:$name, branchMapping:$branchMapping) {
              id
              name
            }
          }
        }`;

      type R = { data: { updateChannel: { createUpdateChannelForApp: ExpoChannel | null } | null } };
      const payload = await this.graphqlRequest<R>(m, {
        appId: this.appId,
        name: channelName,
        branchMapping: JSON.stringify(branchMapping),
      });

      return ensureNode(payload);
    } else {
      const m = `
        mutation ($appId:ID!, $name:String!) {
          updateChannel {
            createUpdateChannelForApp(appId:$appId, name:$name) {
              id
              name
            }
          }
        }`;

      type R = { data: { updateChannel: { createUpdateChannelForApp: ExpoChannel | null } | null } };
      const payload = await this.graphqlRequest<R>(m, {
        appId: this.appId,
        name: channelName,
      });

      return ensureNode(payload);
    }
  }

  /** 1) 롤아웃 시작 */
  async startChannelRollout(
    channelName: string,
    newBranchId: string,
    percent: number /* 1–99 */
  ): Promise<RolloutInfo> {
    if (percent <= 0 || percent >= 100)
      throw new Error('percent must be from 1 to 99');

    // ① 채널 → 현재 연결된 브랜치(id) 파악
    const chMap = await this.fetchChannelMapping(channelName);
    if (!chMap) throw new Error(`Channel '${channelName}' not found or has no branch`);
    const channelId = chMap.id;
    const oldBranchId = (await this.fetchBranches()).find(b => b.name === chMap.branchName)?.id;
    if (!oldBranchId) throw new Error('Could not resolve current branch id');

    // ② rollout branchMapping 생성
    const branchMapping: BranchMapping = {
      version: 0,
      data: [
        {
          branchId: newBranchId,
          branchMappingLogic: `hash_mod(device_id(), 100) < ${percent}`,
        },
        { branchId: oldBranchId, branchMappingLogic: 'true' }, // 롤아웃의 기본분기
      ],
    };

    // ③ 서버 반영
    await this.graphqlRequest(
      `
      mutation ($channelId:ID!,$branchMapping:String!){
        updateChannel{
          editUpdateChannel(channelId:$channelId,branchMapping:$branchMapping){id}
        }
      }`,
      { channelId, branchMapping: JSON.stringify(branchMapping) }
    );

    return { channelId, oldBranchId, newBranchId, percent };
  }

  async updateChannelRolloutPercent(
    channelName: string,
    percent: number
  ): Promise<void> {
    if (percent <= 0 || percent >= 100)
      throw new Error('percent must be from 1 to 99');

    const ch = await this.fetchChannelMapping(channelName);
    if (!ch) throw new Error(`Channel '${channelName}' not found`);
    const channelId = ch.id;

    const query = `
      query ($channelId:ID!){
        updateChannelById(channelId:$channelId){branchMapping}
      }`;
    type Q = { data: { updateChannelById: { branchMapping: string } } };
    const { data } = await this.graphqlRequest<Q>(query, { channelId });
    const mapping: BranchMapping = JSON.parse(data.updateChannelById.branchMapping);

    // 첫 번째 엔트리가 hash_mod(...)라고 가정하고 %만 교체
    mapping.data[0].branchMappingLogic = mapping.data[0].branchMappingLogic.replace(
      /<\s*\d+\s*$/,
      `< ${percent}`
    );

    await this.graphqlRequest(
      `
        mutation ($channelId:ID!,$branchMapping:String!){
          updateChannel{
            editUpdateChannel(channelId:$channelId,branchMapping:$branchMapping){id}
          }
        }`,
      { channelId, branchMapping: JSON.stringify(mapping) }
    );
  }

  async endChannelRollout(
    channelName: string,
    {
      promoteNewBranch = true, // true → 새 브랜치로 100% 전환, false → 롤백
    }: { promoteNewBranch?: boolean } = {}
  ): Promise<void> {
    const ch = await this.fetchChannelMapping(channelName);
    if (!ch) throw new Error(`Channel '${channelName}' not found`);
    const channelId = ch.id;

    const query = `
      query ($channelId:ID!){
        updateChannelById(channelId:$channelId){branchMapping}
      }`;
    type Q = { data: { updateChannelById: { branchMapping: string } } };
    const { data } = await this.graphqlRequest<Q>(query, { channelId });
    const mapping: BranchMapping = JSON.parse(data.updateChannelById.branchMapping);

    if (mapping.data.length !== 2)
      throw new Error('Channel is not in rollout state');

    const targetBranchId = promoteNewBranch
      ? mapping.data[0].branchId
      : mapping.data[1].branchId;

    await this.graphqlRequest(
      `
        mutation ($channelId:ID!,$branchMapping:String!){
          updateChannel{
            editUpdateChannel(channelId:$channelId,branchMapping:$branchMapping){id}
          }
        }`,
      {
        channelId,
        branchMapping: JSON.stringify({
          version: 0,
          data: [{ branchId: targetBranchId, branchMappingLogic: 'true' }],
        }),
      }
    );
  }

  async getChannelMapping(
    channelName: string
  ): Promise<{ channelId: string; branchMappingJson: string; branchMapping: BranchMapping } | null> {
    const q = `
      query ($appId: String!, $channelName: String!) {
        app {
          byId(appId: $appId) {
            updateChannelByName(name: $channelName) {
              id
              branchMapping
            }
          }
        }
      }`;

    type R = {
      data: {
        app: {
          byId: {
            updateChannelByName: { id: string; branchMapping: string } | null;
          };
        };
      };
    };

    const { data } = await this.graphqlRequest<R>(q, { appId: this.appId, channelName });
    const node = data?.app?.byId?.updateChannelByName;
    if (!node) return null;

    let parsed: BranchMapping;
    try {
      parsed = JSON.parse(node.branchMapping) as BranchMapping;
    } catch (e: any) {
      throw new Error(`Invalid branchMapping JSON for channel '${channelName}': ${e?.message ?? e}`);
    }

    return {
      channelId: node.id,
      branchMappingJson: node.branchMapping,
      branchMapping: parsed,
    };
  }

}
