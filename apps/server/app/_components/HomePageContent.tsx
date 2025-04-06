"use client";

import s3Queries from "@/features/s3/queries";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Environment } from "@cloud-push/core";
import { VersionCursorStore } from "@cloud-push/core/version-cursor";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface EnvironmentSelectorProps {
  selectedEnvironment: Environment | null;
  onChange: (selectedEnvironment: Environment) => void;
}

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  selectedEnvironment,
  onChange,
}) => {
  const handleEnvironmentClick = (targetEnvironment: Environment) => {
    // 이미 선택된 환경을 다시 클릭하면 선택 유지 (단일 선택이므로 해제 불가)
    // 다른 환경을 클릭하면 새로운 환경으로 변경
    onChange(targetEnvironment);
  };

  const isSelected = (env: Environment): boolean => {
    return selectedEnvironment === env;
  };

  return (
    <div className="environment-selector">
      <h3>환경 선택</h3>
      <div className="button-group">
        <button
          className={`env-button ${
            isSelected("development") ? "selected" : ""
          }`}
          onClick={() => handleEnvironmentClick("development")}
        >
          Development
        </button>
        <button
          className={`env-button ${isSelected("production") ? "selected" : ""}`}
          onClick={() => handleEnvironmentClick("production")}
        >
          Production
        </button>
        <button
          className={`env-button ${isSelected("preview") ? "selected" : ""}`}
          onClick={() => handleEnvironmentClick("preview")}
        >
          Preview
        </button>
      </div>
      <div className="selected-environments">
        <p>선택된 환경: {selectedEnvironment ? selectedEnvironment : "없음"}</p>
      </div>
    </div>
  );
};

export default function HomePageContent() {
  const { data } = useSuspenseQuery({
    ...s3Queries.versions(),
  });

  const searchParams = useSearchParams();

  // 단일 환경만 가져오기 (여러 개가 있으면 첫 번째 것만 사용)
  const environment = searchParams.get("environment") as Environment | null;

  const router = useRouter();

  const setEnvironment = (targetEnvironment: Environment) => {
    const newSearchParams = new URLSearchParams(searchParams);
    // "environments" 대신 "environment" 단수형 사용
    newSearchParams.set("environment", targetEnvironment);

    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const flatData = useMemo(() => VersionCursorStore.deserialize(data), [data]);

  return (
    <div className="w-full flex flex-col">
      <EnvironmentSelector
        selectedEnvironment={environment}
        onChange={setEnvironment}
      />
      <div className="w-full flex flex-col">
        {flatData
          ?.find({ environment: environment ?? undefined })
          .sort({ field: "createdAt", order: "desc" })
          .map(([bundleId, versionCursorData]) => {
            return (
              <div className="flex gap-4" key={bundleId}>
                <span>runtimeVersion : {versionCursorData.runtimeVersion}</span>
                <span>bundleId : {bundleId}</span>
                <p className="flex gap-4">
                  <span>platforms :</span>
                  {versionCursorData.platforms.map((platform) => (
                    <span key={platform}>{platform}</span>
                  ))}
                </p>
                <p className="flex gap-4">
                  <span>createdAt :</span>
                  {new Date(versionCursorData.createdAt).toLocaleString()}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
