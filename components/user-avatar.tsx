import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  src?: string;
  className?: string;
  avatarClassName?: string;
}

const UserAvatar = ({ src, className, avatarClassName }: UserAvatarProps) => {
  return (
    <Avatar className={`h-7 w-7 md:h-10 md:w-10 ${avatarClassName}`}>
      <AvatarImage src={src} className={` ${className}`} />
    </Avatar>
  );
};

export default UserAvatar;
