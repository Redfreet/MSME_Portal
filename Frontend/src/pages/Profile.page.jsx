import { useAuth } from "../context/AuthContent";
import ActivityStream from "../components/ActivityStream";

const ProfilePage = () => {
  const { authUser, loading } = useAuth(); //early loaded so no content on profile

  if (loading) {
    return <p className="text-center mt-8">Loading profile...</p>;
  }

  if (!authUser) {
    return <p className="text-center">Please log in to view your profile.</p>;
  }

  //loading is false and we have a user, render the profile
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {/* --- Profile Header with Picture --- */}
        <div className="flex items-center space-x-6 mb-6">
          <img
            className="h-24 w-24 rounded-full ring-4 ring-blue-100"
            src={
              authUser.profile?.profilePhoto ||
              `https://placehold.co/100x100/EFEFEF/AAAAAA?text=${authUser.fullName.charAt(
                0
              )}`
            }
            alt="Profile"
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {authUser.fullName}
            </h1>
            <p className="text-lg text-blue-600 font-semibold capitalize mt-1">
              {authUser.role}
            </p>
          </div>
        </div>

        {/* --- User Details --- */}
        <div className="border-t border-gray-200 pt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{authUser.email}</dd>
            </div>

            {authUser.role === "corporate" && (
              <>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Industry
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {authUser.industry || "Not specified"}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="mt-1 text-sm text-blue-500 hover:underline">
                    <a
                      href={authUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {authUser.website || "Not specified"}
                    </a>
                  </dd>
                </div>
              </>
            )}

            {authUser.role === "collaborator" && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {authUser.profile?.bio || "No bio provided."}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <ActivityStream />
      </div>
    </div>
  );
};

export default ProfilePage;
