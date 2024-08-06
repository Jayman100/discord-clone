import { currentUser, auth } from "@clerk/nextjs/server";

import { db } from "./db";

const initalProfile = async () => {
  const user: any = await currentUser();

  if (!user) return auth().redirectToSignIn();

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) return profile;

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};

export default initalProfile;