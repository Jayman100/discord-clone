import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: { serverId: string };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },

    include: {
      channels: {
        where: {
          name: "general",
        },

        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initailChannel = server?.channels.find(
    (channel) => channel.name === "general"
  );

  if (server)
    return redirect(
      `/server/${params?.serverId}/channels/${initailChannel?.id}`
    );
};

export default ServerIdPage;
