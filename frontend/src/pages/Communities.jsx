/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommunities, joinCommunity } from "../features/community/communitySlice";
import { Link } from "react-router-dom";

const CommunityList = () => {
  const dispatch = useDispatch();
  const { communities, loading, error } = useSelector((state) => state.community);
  const { user } = useSelector((state) => state.auth); 

  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Communities</h1>
        <Link
          to="/communities/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + Create Community
        </Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4">
        {communities.map((c) => (
          <div
            key={c._id}
            className="p-4 border rounded-lg shadow mb-4 flex justify-between items-center"
          >
            <div>
              {/* Clicking name goes to /communities/:id */}
              <Link
                to={`/communities/${c._id}`}
                className="text-lg font-bold text-blue-600 hover:underline"
              >
                {c.name}
              </Link>
              <p className="text-gray-600">{c.description}</p>
            </div>

            {/* Buttons or login prompt */}
            {user ? (
              c.members?.includes(user.id) ? (
                <button
                  disabled
                  className="bg-gray-400 px-3 py-1 rounded-lg text-white cursor-not-allowed"
                >
                  Joined
                </button>
              ) : (
                <button
                  onClick={() => dispatch(joinCommunity(c._id))}
                  className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-white"
                >
                  Join
                </button>
              )
            ) : (
              <p className="text-sm text-gray-500 italic">Login to join</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityList;
