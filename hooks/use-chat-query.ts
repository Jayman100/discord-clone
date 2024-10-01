import qs from "query-string";

import { useSocket } from "@/components/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramValue,
  paramKey,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  //? pageParam => need for infinite scroll , data will fetch dynamically when we scroll to an extent

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    //     const url = `${apiUrl}?${paramKey}=${paramValue}&cursor=${pageParam}`;
    console.log(url, "url");
    const res = await fetch(url);

    return res.json();
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
