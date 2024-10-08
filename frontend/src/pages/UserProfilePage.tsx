import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form";
import { useAuth0 } from "@auth0/auth0-react";

const UserProfilePage = () => {
  const { currentUser, isLoading: isGetLoading } = useGetMyUser();
  const { updateUser, isLoading } = useUpdateMyUser();
  const { user, isLoading: isUserLoading } = useAuth0();

  if (isGetLoading) {
    return <span className="w-full h-[100%] flex items-center justify-center font-bold text-2xl">Loading...</span>;
  }

  if (!currentUser) {
    return <span className="w-full h-[100%] flex items-center justify-center font-bold text-2xl">Unable to load user profile</span>;
  }

  if (isUserLoading) {
    return <span className="w-full h-[100%] flex items-center justify-center font-bold text-2xl">Loading user profile...</span>;
  }

  // If the user is not authenticated, you can handle it here
  if (!user) {
    return <span>User not authenticated</span>;
  }

  const auth0Id = user.sub as string;

  return (
    <UserProfileForm
      currentUser={currentUser}
      auth0Id={auth0Id}
      onSave={updateUser}
      isLoading={isLoading}
    />
  );
};

export default UserProfilePage;