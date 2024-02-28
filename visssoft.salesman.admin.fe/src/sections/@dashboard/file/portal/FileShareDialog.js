import PropTypes from 'prop-types';
// @mui
import { List, Stack, Dialog, Button, TextField, DialogTitle, DialogActions, DialogContent } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
//
import FileInvitedItem from '../FileInvitedItem';
import { FolderUserSearch } from '../../folder';
import { useCallback, useEffect } from 'react';
import { dispatch } from 'src/redux/store';
import { getOneDocumentRedux, handleSendInviteRedux } from 'src/redux/slices/document';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

// FileShareDialog.propTypes = {
//   open: PropTypes.bool,
//   onClose: PropTypes.func,
// };

export default function FileShareDialog({ file, open, onClose, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const { getOne } = useSelector((state) => state.document);
  console.log('FileShareDialog', getOne);
  const hasShared = getOne && !!getOne.listShare.length;

  const handleSendInvite = useCallback(async () => {
    console.log('handleSendInvite');
    const message = await dispatch(handleSendInviteRedux(getOne));
    if (message) {
      enqueueSnackbar(message.title, { variant: message.variant });
    }
  }, [getOne]);
  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
        <DialogTitle> Chia sẻ tài liệu </DialogTitle>

        <DialogContent sx={{ overflow: 'unset' }}>
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <FolderUserSearch />
            <Button variant="contained" sx={{ flexShrink: 0 }} onClick={handleSendInvite}>
              Chia sẻ
            </Button>
          </Stack>

          {hasShared && (
            <Scrollbar sx={{ maxHeight: 60 * 6 }}>
              <List disablePadding>
                {getOne.listShare.map(({ user, permission }, index) => (
                  <FileInvitedItem key={user.id} user={user} permissionDefault={permission} index={index} />
                ))}
              </List>
            </Scrollbar>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between' }}>
          {onClose && (
            <Button variant="outlined" color="inherit" onClick={onClose}>
              Đóng
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
