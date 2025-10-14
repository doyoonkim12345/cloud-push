import * as prompts from "@clack/prompts";
import type { ExpoBranch } from "@cloud-push/cloud";

export const selectBranch = async ({ branches }: { branches: ExpoBranch[] }): Promise<string> => {
    const branch = await prompts.select({
        message: 'Which branch do you want to use?',
        options: branches.map(branch => ({ label: branch.name, value: branch.name })),
    })
    return branch as string
}

export const getBranch = async ({
    branches,
    defaultValue,
}: {
    branches: ExpoBranch[];
    defaultValue?: string;
}): Promise<string> => {
    if (branches.length > 0) {
        const options = branches.map((b) => ({
            label: b.name,
            value: b.name, // 선택 결과는 여기 넣은 value로 반환됩니다
            hint: b.id,    // 선택지 오른쪽에 id 힌트로 보여주기 (선택)
        }));

        const initialValue =
            defaultValue && branches.some((b) => b.name === defaultValue)
                ? defaultValue
                : undefined;

        const res = await prompts.select({
            message: "사용할 브랜치를 선택하세요",
            options,
            initialValue, // defaultValue가 목록에 있으면 초기 선택으로 지정
        });

        if (prompts.isCancel(res)) {
            prompts.cancel("작업이 취소되었습니다.");
            throw new Error("User cancelled");
        }

        return res as string;
    }

    const res = await prompts.text({
        message: "생성/사용할 브랜치 이름을 입력하세요",
        placeholder: "예: main, staging, dev",
        initialValue: defaultValue,
        validate: (v) =>
            v && v.trim().length > 0 ? undefined : "브랜치 이름을 입력해주세요.",
    });

    if (prompts.isCancel(res)) {
        prompts.cancel("작업이 취소되었습니다.");
        throw new Error("User cancelled");
    }

    return String(res);
};