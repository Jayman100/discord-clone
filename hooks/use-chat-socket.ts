import { useSocket } from "@/components/providers/socket-provider";
import { MessagesWithMemberWithProfile } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type chatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: chatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (message: MessagesWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return oldData;

        //*new data uses the old data to check the data to replace -> using the id

        const newData = oldData.pages.map((pages: any) => {
          return {
            ...pages,
            item: pages.items.map((item: MessagesWithMemberWithProfile) => {
              if (item.id === message.id) return message;

              return item;
            }),
          };
        });

        return { ...oldData, pages: newData };
      });
    });

    socket.on([addKey], (message: MessagesWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [socket, addKey, updateKey, queryKey, queryClient]);
};
