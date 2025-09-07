import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TagBox from '../../components/write/TagBox';
import { changeField } from '../../modules/write';

const TagBoxContainer = () => {
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.write.tags);

  const onChangeTags = useCallback(
    (nextTags) => {
      dispatch(changeField({ key: 'tags', value: nextTags }));
    },
    [dispatch],
  );

  return <TagBox tags={tags} onChangeTags={onChangeTags} />;
};

export default TagBoxContainer;
