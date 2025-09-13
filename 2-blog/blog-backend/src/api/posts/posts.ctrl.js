import Post from '../../models/post.js';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

const { ObjectId } = mongoose.Types;

const sanitizeOption = {
  allowedTags: ['h1', 'h2', 'b', 'i', 'u', 's', 'p', 'ul', 'ol', 'li', 'blockquote', 'a', 'img'],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};

export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
    const post = await Post.findById(id);
    // 포스트가 존재하지 않을 때
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403; // Forbidden
    return;
  }
  return next();
}

/*
POST /api/posts
{
  title: '제목',
  body: '내용',
  tags: ['태그1', '태그2'],
}
*/
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required()가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body: sanitizeHtml(body, sanitizeOption),
    tags,
    user: ctx.state.user
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

// html을 없애고 내용이 너무 길면 200자로 제한하는 함수
const removeHtmlAndShorten = body => {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
}

// GET /api/posts?username=&tag=&page=
export const list = async (ctx) => {
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  // tag, username 값이 유효하다면 객체 안에 넣고, 그렇지 않으면 넣지 않음
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}), // 배열 필드에서 단일 값으로 검색하면, "그 배열 안에 그 값이 있는지"를 자동으로 매칭해줌
  }

  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 }) // 포스트를 역순으로 불러오기
      .skip((page - 1) * 10) // 현재 페이지의 데이터를 주기 위해 넘기기
      .limit(10) // 한 페이지 당 10개씩만 주기
      .lean() // Document 객체를 JSON 형태로 변환
      .exec();
    const postCount = await Post.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10)); // http 헤더 설정
    ctx.body = posts.map((post) => ({
      ...post,
      body: removeHtmlAndShorten(post.body),
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

// GET /api/posts/:id
export const read = async (ctx) => {
  ctx.body = ctx.state.post;
};

// DELETE /api/posts/:id
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndDelete(id).exec();
    ctx.status = 204; // No Content
  } catch (e) {
    ctx.throw(500, e);
  }
};

// PATCH /api/posts/:id
// {
//   title: '수정',
//   body: '수정 내용',
//   tags: ['수정', '태그']
// }
export const update = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { id } = ctx.params;

  const nextData = { ...ctx.request.body };
  if (nextData.body) {
    nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
  }
  try {
    const post = await Post.findByIdAndUpdate(id, nextData, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환, false면 업데이트되기 전 데이터를 반환
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
