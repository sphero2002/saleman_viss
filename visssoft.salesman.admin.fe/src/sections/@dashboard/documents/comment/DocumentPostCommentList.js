import PropTypes from 'prop-types';
// @mui
import { Box, List } from '@mui/material';
//
import DocumentPostCommentItem from './DocumentPostCommentItem';

// ----------------------------------------------------------------------

DocumentPostCommentList.propTypes = {
  comments: PropTypes.array,
};

export default function DocumentPostCommentList({ comments }) {
  return (
    <List disablePadding>
      {comments.map((comment) => {
        const { id, replyComment, name, users, message, avatarUrl, postedAt } = comment;

        const hasReply = replyComment.length > 0;

        return (
          <Box key={id}>
            <DocumentPostCommentItem name={name} message={message} postedAt={postedAt} avatarUrl={avatarUrl} />
            {hasReply &&
              replyComment.map((reply) => {
                const userReply = users.find((user) => user.id === reply.userId);

                return (
                  <DocumentPostCommentItem
                    key={reply.id}
                    name={userReply?.name || ''}
                    message={reply.message}
                    postedAt={reply.postedAt}
                    avatarUrl={userReply?.avatarUrl || ''}
                    tagUser={reply.tagUser}
                    hasReply
                  />
                );
              })}
          </Box>
        );
      })}
    </List>
  );
}
