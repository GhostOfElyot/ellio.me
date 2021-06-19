import useSWR from "swr";

const fetcher = (url: string) => {
    return fetch(url).then((res) => {
        if (res.status == 200) {
            return res.json();
        }

        return false;
    });
};

const useFetcher = (
    query: string,
    initialData = null,
    refreshInterval = 2000,
    isPaused = () => false
) => {
    const url = `${query}`;

    const { data, error, isValidating, mutate } = useSWR([url], fetcher, {
        initialData,
        refreshInterval,
        revalidateOnMount: true,
        dedupingInterval: refreshInterval,
        isPaused,
    });

    return {
        data,
        isValidating,
        mutate,
        isLoading: !error && !data,
        isError: error,
    };
};

export default useFetcher;
