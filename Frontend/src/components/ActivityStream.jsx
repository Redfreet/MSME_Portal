import React, { useState, useEffect } from "react";
import authService from "../api/authService.js";

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const ActivityIcon = ({ type }) => {
  let icon;
  switch (type) {
    case "POSTED_PROBLEM":
      icon = "📝";
      break;
    case "SUBMITTED_SOLUTION":
      icon = "✅";
      break;
    case "UPVOTED_SOLUTION":
      icon = "👍";
      break;
    default:
      icon = "🔔";
  }
  return <span className="text-xl">{icon}</span>;
};

const ActivityStream = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await authService.getActivity();
        setActivities(response.data);
      } catch (err) {
        setError("Failed to load activity.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-md mt-6">
        Loading activity...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-md mt-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Recent Activity
      </h2>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <li key={activity._id}>
                <div className="relative pb-8">
                  {/* Vertical line connector, but not for the last item */}
                  {index !== activities.length - 1 ? (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center ring-8 ring-white">
                        <ActivityIcon type={activity.type} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5">
                      <div className="text-sm text-gray-700">
                        {activity.title}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {timeAgo(activity.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No recent activity to display.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ActivityStream;
