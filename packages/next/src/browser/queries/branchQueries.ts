import { services } from "../services";

export const branchQueries = {
    all: {
        queryKey: ["branch"],
    },
    detail: () => ({
        queryKey: [...branchQueries.all.queryKey],
        queryFn: services.getBranches,
    }),
};
