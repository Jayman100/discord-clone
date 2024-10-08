import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface inviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: inviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  if (!params.inviteCode) return redirect("/");

  // If the user looding the link is already in the server

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) return redirect(`/server/${existingServer.id}`);

  //Create new member if the person loading the link is not a member of the server
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },

    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) return redirect(`/server/${server.id}`);

  return null;
};

export default InviteCodePage;
