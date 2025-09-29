import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import communityReducer from "../features/community/communitySlice";
import postReducer from "../features/post/postSlice";
import commentReducer from "../features/comment/commentSlice";
import reactionReducer from "../features/reaction/reactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
    post: postReducer,
    comments: commentReducer, 
    reactions: reactionReducer,
  },
});
