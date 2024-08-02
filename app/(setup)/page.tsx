import InitialModal from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import initalProfile from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initalProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`server/${server.id}`);
  }

  return (
    <div>
      <InitialModal />
    </div>
  );
};

export default SetupPage;
