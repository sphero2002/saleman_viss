import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Avatar, Button, Divider, Tooltip, ListItem, MenuItem, ListItemText, ListItemAvatar } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import { useSelector } from 'react-redux';
import { dispatch } from 'src/redux/store';
import { handleChangePermissionRedux, getOneDocumentRedux } from 'src/redux/slices/document';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

export default function FileInvitedItem({ index }) {
    const { getOne } = useSelector((state) => state.document);
    const { enqueueSnackbar } = useSnackbar();
    console.log('FileInvitedItem', getOne, index);
    const { user, permission: permissionDefault } = getOne.listShare[index];
    const [openPopover, setOpenPopover] = useState(null);

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    const handleChangePermission = async (permission) => {
        const messagexx = await dispatch(getOneDocumentRedux(getOne.id));
        console.log('messagexx', messagexx);
        if (messagexx && messagexx.variant) {
            enqueueSnackbar('Bạn không có quyền Hủy chia sẻ Tài liệu này', { variant: messagexx.variant });
            return;
        }
        const message = await dispatch(handleChangePermissionRedux(getOne, user, index, permission));
        if (message) {
            console.log('Message', message);
            if (message.variant == 'error') {
                enqueueSnackbar('Bạn không có quyền Hủy chia sẻ Tài liệu này', { variant: message.variant });
                return;
            }
            enqueueSnackbar(message.title, { variant: message.variant });
        }
    };

    return (
        <>
            <ListItem disableGutters>
                <ListItemAvatar>
                    <Avatar
                        src={window.location.origin + `/assets/images/avatars/avatar_${(1 - user.gender) * 10 + (user.id % 10) + 1
                            }.jpg`}
                        alt={user.firstName + user.lastName}
                    />
                </ListItemAvatar>

                <ListItemText
                    primary={user.firstName + ' ' + user.lastName}
                    secondary={
                        <Tooltip title={user.firstName + ' ' + user.lastName}>
                            <span>{user.email}</span>
                        </Tooltip>
                    }
                    primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
                    secondaryTypographyProps={{ noWrap: true }}
                    sx={{ flexGrow: 1, pr: 1 }}
                />

                <Button
                    size="small"
                    color="inherit"
                    endIcon={<Iconify icon={openPopover ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
                    onClick={handleOpenPopover}
                    sx={{
                        flexShrink: 0,
                        textTransform: 'unset',
                        fontWeight: 'fontWeightMedium',
                        '& .MuiButton-endIcon': {
                            ml: 0,
                        },
                        ...(openPopover && {
                            bgcolor: 'action.selected',
                        }),
                    }}
                >
                    Có thể {permissionDefault ? 'chỉnh sửa' : 'xem'}
                </Button>
            </ListItem>

            <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 160 }}>
                <>
                    {/* không remove code cmt ở đây  */}
                    {/* <MenuItem
            disabled={true}
            onClick={() => {
              handleClosePopover();
              handleChangePermission(0);
            }}
            sx={{
              ...(permissionDefault === 0 && {
                bgcolor: 'action.selected',
              }),
            }}
          >
            <Iconify icon="eva:eye-fill" />
            Có thể xem
          </MenuItem>

          <MenuItem
            disabled={true}
            onClick={() => {
              handleClosePopover();
              handleChangePermission(1);
            }}
            sx={{
              ...(permissionDefault === 1 && {
                bgcolor: 'action.selected',
              }),
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Có thể chỉnh sửa
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} /> */}

                    <MenuItem
                        onClick={() => {
                            handleClosePopover();
                            handleChangePermission(2);
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="eva:trash-2-outline" />
                        Xóa
                    </MenuItem>
                </>
            </MenuPopover>
        </>
    );
}
