import PropTypes from 'prop-types';
import _ from 'lodash';
import { useState } from 'react';
// @mui
import { Box, Card, Stack, Button, Divider, MenuItem, Checkbox, IconButton } from '@mui/material';
// hooks
import useCopyToClipboard from '../../../../hooks/useCopyToClipboard';
// components
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import TextMaxLine from '../../../../components/text-max-line';
import { useSnackbar } from '../../../../components/snackbar';
import ConfirmDialog from '../../../../components/confirm-dialog';
import FileShareDialog from '../portal/FileShareDialog';
import FileNewFolderDialog from '../portal/FileNewFolderDialog';

import { dispatch } from 'src/redux/store';
import {
  deleteSubFolderInFolderRedux,
  deleteSubFolderInStoreFolderRedux,
  getFolderRedux,
  getStoreFolderRedux,
  updateSubFolderRedux,
  updateSubStoreFolderRedux,
} from 'src/redux/slices/folder';

export default function FileFolderCard({ data, folder, selected, onSelect, onDelete, sx, ...other }) {
  console.log('FileFolderCard', data, folder);

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const [showCheckbox, setShowCheckbox] = useState(false);

  const [openShare, setOpenShare] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);

  const [folderName, setFolderName] = useState(folder.name);

  const [openEditFolder, setOpenEditFolder] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const [favorited, setFavorited] = useState(folder.isFavorited);

  const handleFavorite = () => {
    setFavorited(!favorited);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleShowCheckbox = () => {
    // console.log('handleShowCheckbox');
    // setShowCheckbox(true);
    // router.push({
    //   pathname: `${PATH_DASHBOARD.general.file}/[pid]`,
    //   query: { pid: '/project/work' },
    // });
  };

  const handleHideCheckbox = () => {
    setShowCheckbox(false);
  };

  const handleOpenShare = () => {
    setOpenShare(true);
  };

  const handleCloseShare = () => {
    setOpenShare(false);
  };

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const handleOpenEditFolder = () => {
    setOpenEditFolder(true);
  };

  const handleCloseEditFolder = () => {
    setOpenEditFolder(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleChangeInvite = (event) => {
    setInviteEmail(event.target.value);
  };

  const handleCopy = () => {
    enqueueSnackbar('Copied!');
    copy(folder.url);
  };

  const handleOnClickFileFolderCard = async (folderID) => {
    if (data.types.length) {
      const message = await dispatch(getFolderRedux(folderID, data.types[0]));
      if (message && message.variant) {
        enqueueSnackbar(message.title, { variant: message.variant });
      }
      return;
    }
  };

  const handleDeleteFolder = async () => {
    if (data.types.find((type) => type === 'storeFolder')) {
      const message = await dispatch(deleteSubFolderInStoreFolderRedux(folder.id));
      if (message) {
        enqueueSnackbar(message.title, { variant: message.variant });
      }
      handleCloseConfirm();
    } else if (data.types.find((type) => type === 'folder')) {
      const message = await dispatch(deleteSubFolderInFolderRedux(folder.id));
      if (message) {
        enqueueSnackbar(message.title, { variant: message.variant });
      }
      handleCloseConfirm();
    } else {
      enqueueSnackbar(`Chỉ được xóa tài liệu ở thư mục của tôi và thư mục chung`, { variant: `error` });
    }
  };

  const handleUpdateSubFolder = async () => {
    if (data.types.find((type) => type === 'storeFolder')) {
      const message = await dispatch(updateSubStoreFolderRedux(folder.id, { name: folderName }));
      if (message) {
        enqueueSnackbar(message.title, { variant: message.variant });
      }
      setFolderName(folderName);
      handleCloseEditFolder();
    } else if (data.types.find((type) => type === 'folder')) {
      const message = await dispatch(updateSubFolderRedux(folder.id, { name: folderName }));
      if (message) {
        enqueueSnackbar(message.title, { variant: message.variant });
      }
      setFolderName(folderName);
      handleCloseEditFolder();
    } else {
      enqueueSnackbar(`Chỉ được sửa thư mục ở thư mục của tôi và thư mục chung`, { variant: `error` });
    }
  };

  return (
    <>
      <Card
        onMouseEnter={handleShowCheckbox}
        onMouseLeave={handleHideCheckbox}
        sx={{
          p: 2.5,
          width: 1,
          maxWidth: 222,
          boxShadow: 0,
          bgcolor: 'background.default',

          border: (theme) => `solid 1px ${theme.palette.divider}`,
          ...((showCheckbox || selected) && {
            borderColor: 'transparent',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
          {!_.isEmpty(data.menuSubFolder) && (
            <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </Stack>

        {(showCheckbox || selected) && onSelect ? (
          <Checkbox
            checked={selected}
            onClick={onSelect}
            icon={<Iconify icon="eva:radio-button-off-fill" />}
            checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          />
        ) : (
          <Box
            onClick={() => handleOnClickFileFolderCard(folder.id)}
            component="img"
            src="/assets/icons/files/ic_folder.svg"
            sx={{
              width: 40,
              height: 40,
              '&:hover': {
                bgcolor: 'background.paper',
                boxShadow: (theme) => theme.customShadows.z20,
                cursor: 'pointer',
              },
            }}
          />
        )}

        <TextMaxLine variant="h6" onClick={handleOpenDetails} sx={{ mt: 1, mb: 0.5 }}>
          {folder.name}
        </TextMaxLine>
      </Card>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
        {data.menuSubFolder.find((element) => element === 'edit') && (
          <MenuItem
            onClick={() => {
              handleClosePopover();
              handleOpenEditFolder();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Đổi tên
          </MenuItem>
        )}

        {data.menuSubFolder.find((element) => element === 'delete') && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem
              onClick={() => {
                handleOpenConfirm();
                handleClosePopover();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="eva:trash-2-outline" />
              Xóa
            </MenuItem>
          </>
        )}
      </MenuPopover>

      {/* <FileDetailsDrawer
        item={folder}
        favorited={favorited}
        onFavorite={handleFavorite}
        onCopyLink={handleCopy}
        open={openDetails}
        onClose={handleCloseDetails}
        onDelete={() => {
          handleCloseDetails();
          onDelete();
        }}
      /> */}
      {openShare && (
        <FileShareDialog
          open={openShare}
          shared={folder.shared}
          inviteEmail={inviteEmail}
          onChangeInvite={handleChangeInvite}
          onCopyLink={handleCopy}
          onClose={() => {
            handleCloseShare();
            setInviteEmail('');
          }}
        />
      )}

      {openEditFolder && (
        <FileNewFolderDialog
          open={openEditFolder}
          onClose={handleCloseEditFolder}
          title="Sửa Thư mục"
          onUpdate={handleUpdateSubFolder}
          folderName={folderName}
          onChangeFolderName={(event) => setFolderName(event.target.value)}
        />
      )}

      {openConfirm && (
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Xóa thư mục"
          content="Bạn có chắc chắn muốn xóa thư mục này?"
          action={
            <Button variant="contained" color="error" onClick={handleDeleteFolder}>
              Xóa
            </Button>
          }
        />
      )}
    </>
  );
}
