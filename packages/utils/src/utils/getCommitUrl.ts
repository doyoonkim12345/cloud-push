export const getCommitUrl = ({
	repositoryUrl,
	gitHash,
}: { repositoryUrl: string; gitHash: string }) => {
	// .git 제거 + GitHub 웹 주소로 변환
	const webUrl = repositoryUrl
		.replace(/^git@github\.com:/, "https://github.com/")
		.replace(/^https:\/\/github\.com\//, "https://github.com/")
		.replace(/\.git$/, "");

	return `${webUrl}/commit/${gitHash}`;
};
