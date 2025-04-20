"use client";

import { dbBrowserClient } from "@/features/api/browserClient";
import versionsQueries from "@/features/versions/queries";
import { findRollbackTargetBundle } from "@/features/versions/utils/findRollbackTargetBundle";
import { findUpdateTargetBundle } from "@/features/versions/utils/findUpdateTargetBundle";
import { Bundle, UpdatePolicy } from "@cloud-push/cloud";
import { Environment } from "@cloud-push/core";
import { groupBy } from "@cloud-push/core/utils";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { rcompare } from "semver";

interface EnvironmentSelectorProps {
  selectedEnvironment: Environment | null;
  onChange: (selectedEnvironment: Environment) => void;
}

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  selectedEnvironment,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Select Environment</h2>
      <div className="flex gap-3">
        {["development", "production", "preview"].map((env) => (
          <button
            key={env}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedEnvironment === env
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => onChange(env as Environment)}
          >
            {env}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function HomePageContent({
  environment,
  runtimeVersion,
}: {
  environment: Environment;
  runtimeVersion?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: bundles } = useSuspenseQuery({
    ...versionsQueries.versions(environment),
  });

  const setEnvironment = (targetEnvironment: Environment) => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("environment", targetEnvironment);
    newSearchParams.delete("runtimeVersion");
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const setRuntimeVersion = (version: string) => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("runtimeVersion", version);
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleUpdatePolicyChange = async (
    bundle: Bundle,
    updatePolicy: UpdatePolicy
  ) => {
    await dbBrowserClient("update", { bundle: { ...bundle, updatePolicy } });
    await dbBrowserClient("sync");
    await queryClient.invalidateQueries({
      queryKey: versionsQueries.versions(environment).queryKey,
    });
  };

  const bundlesByRuntime = useMemo(
    () => groupBy(bundles, "runtimeVersion"),
    [bundles]
  );

  const runtimeVersions = useMemo(
    () => Object.keys(bundlesByRuntime).toSorted(rcompare),
    [bundlesByRuntime]
  );

  const targetRuntimeVersion: string | undefined =
    runtimeVersion ?? runtimeVersions[0];
  const targetBundles = bundlesByRuntime[targetRuntimeVersion];
  const androidUpdatableBundles =
    targetBundles?.filter((e) => e.supportAndroid) ?? [];
  const iosUpdatableBundles = targetBundles?.filter((e) => e.supportIos) ?? [];

  const androidLastestBundle = androidUpdatableBundles?.filter(
    (e) => e.updatePolicy === "NORMAL_UPDATE"
  )[0];
  const iosLatestBundle = iosUpdatableBundles?.filter(
    (e) => e.updatePolicy === "NORMAL_UPDATE"
  )[0];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* 헤더 */}
      <header className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-md">
        <img src="/logo.png" alt="Cloud Push Logo" className="h-10" />
        <h1 className="text-2xl font-bold text-gray-800">
          Cloud Push Dashboard
        </h1>
      </header>

      {/* 환경 선택기 */}
      <EnvironmentSelector
        selectedEnvironment={environment ?? null}
        onChange={setEnvironment}
      />

      {/* 런타임 버전 선택기 */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Select Runtime Version</h2>
        <div className="flex flex-wrap gap-2">
          {runtimeVersions.map((version) => (
            <button
              key={version}
              onClick={() => setRuntimeVersion(version)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                version === targetRuntimeVersion
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {version}
            </button>
          ))}
        </div>
      </div>

      {/* 번들 리스트 */}
      <div className="space-y-4">
        {targetBundles?.map((bundle, index) => (
          <div
            key={bundle.bundleId}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-4">
                  <span className="text-blue-600">#{index + 1}</span> Bundle ID
                  <div className="flex gap-2">
                    {androidLastestBundle?.bundleId === bundle.bundleId && (
                      <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded">
                        Android Latest
                      </span>
                    )}
                    {iosLatestBundle?.bundleId === bundle.bundleId && (
                      <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded">
                        iOS Latest
                      </span>
                    )}
                  </div>
                </h3>
                <p className="text-sm break-all text-gray-600 mt-1">
                  {bundle.bundleId}
                </p>
              </div>

              <div className="space-y-2">
                {(
                  [
                    "FORCE_UPDATE",
                    "NORMAL_UPDATE",
                    "ROLLBACK",
                  ] as UpdatePolicy[]
                ).map((policy) => (
                  <button
                    key={policy}
                    onClick={() => handleUpdatePolicyChange(bundle, policy)}
                    className={`px-4 py-1 rounded-md text-xs font-medium transition ${
                      bundle.updatePolicy === policy
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {policy.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Platforms:</strong> Android:{" "}
                {bundle.supportAndroid ? "✅" : "❌"}, iOS:{" "}
                {bundle.supportIos ? "✅" : "❌"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(bundle.createdAt).toLocaleString()}
              </p>

              {/* ✅ 수정된 부분: <p> 태그 밖에 <ul> 위치 */}
              <div>
                <p className="mb-1">
                  <strong>Policy Target:</strong>
                </p>
                <ul className="ml-4 list-disc text-xs">
                  {bundle.updatePolicy === "ROLLBACK" ? (
                    <>
                      {bundle.supportAndroid && (
                        <li>
                          Android →{" "}
                          {findRollbackTargetBundle(
                            androidUpdatableBundles,
                            bundle.bundleId
                          )?.bundleId ?? "embedded"}
                        </li>
                      )}
                      {bundle.supportIos && (
                        <li>
                          iOS →{" "}
                          {findRollbackTargetBundle(
                            iosUpdatableBundles,
                            bundle.bundleId
                          )?.bundleId ?? "embedded"}
                        </li>
                      )}
                    </>
                  ) : (
                    <>
                      {bundle.supportAndroid && (
                        <li>
                          Android →{" "}
                          {findUpdateTargetBundle(
                            androidUpdatableBundles,
                            bundle.bundleId
                          )?.bundleId ?? "latest"}
                        </li>
                      )}
                      {bundle.supportIos && (
                        <li>
                          iOS →{" "}
                          {findUpdateTargetBundle(
                            iosUpdatableBundles,
                            bundle.bundleId
                          )?.bundleId ?? "latest"}
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
