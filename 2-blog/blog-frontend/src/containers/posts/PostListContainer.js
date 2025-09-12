import qs from 'qs';
import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../../components/posts/PostList';
import { listPosts } from '../../modules/posts';

const PostListContainer = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const location = useLocation();
  const { posts, error, loading, user } = useSelector(
    ({ posts, loading, user }) => ({
      posts: posts.posts,
      error: posts.error,
      loading: loading['posts/LIST_POSTS'],
      user: user.user,
    }),
  );

  useEffect(() => {
    const { tag, page } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    const cleanUsername = username?.startsWith('@') ? username.slice(1) : username;
    dispatch(listPosts({ tag, username: cleanUsername, page }));
  }, [dispatch, location.search, username]);

  return (
    <PostList
      loading={loading}
      error={error}
      posts={posts}
      showWriteButton={user}
    />
  );
};

export default PostListContainer;