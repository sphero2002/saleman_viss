import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    MenuItem,
    TableCell,
    IconButton,
    Typography,
    Chip,
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { useAuthContext } from "../../../../auth/useAuthContext";
import { changePasswordAdmin } from "../../../../dataProvider/agent";
import { useSnackbar } from "../../../../components/snackbar";

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
    row: PropTypes.array,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
};

export default function UserTableRow({ data, selected, onEditRow, onSelectRow, onDeleteRow }) {
    const { id, userName, firstName, lastName, email, roles, gender, phone, address, birthDate, enable } = data;
    console.log('data', data);
    const { ROLES } = useAuthContext();

    const [openConfirm, setOpenConfirm] = useState(false);

    const [openConfirmResetPassword, setOpenConfirmResetPassword] = useState(false);

    const [openPopover, setOpenPopover] = useState(null);

    const { enqueueSnackbar } = useSnackbar();

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleOpenConfirmResetPassword = () => {
        setOpenConfirmResetPassword(true);
    };

    const handleCloseConfirmResetPassword = () => {
        setOpenConfirmResetPassword(false);
    };

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
        console.log(ROLES)
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    const handleResetUser = async (idUser) => {
        try {
            const responseReset = await changePasswordAdmin(idUser)
            if (responseReset.status < 400) {
                enqueueSnackbar('Reset mật khẩu người dùng thành công');
            } else {
                enqueueSnackbar(`${responseReset.response.data.title}`, { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
        }
    };

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell>
                    <Avatar src={window.location.origin + `/assets/images/avatars/avatar_${(1 - gender) * 10 + (id % 10) + 1}.jpg`} />
                </TableCell>
                <TableCell align="left">{userName}</TableCell>
                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                            {`${firstName} ${lastName}`}
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell align="left">{gender ? 'Nữ' : 'Nam'}</TableCell>

                <TableCell align="left">{new Date(birthDate)?.toLocaleDateString().padStart(10, '0')}</TableCell>
                <TableCell align="left">{email}</TableCell>
                <TableCell align="left">{phone}</TableCell>
                <TableCell align="left">{address}</TableCell>

                <TableCell>
                    {roles.map((r) =>
                        r === null || '' ? (
                            <Label></Label>
                        ) : (
                            <Label key={r.id} variant="soft" color={'success'} sx={{ textTransform: 'capitalize' }}>
                                {r.name}
                            </Label>
                        )
                    )}
                </TableCell>

                <TableCell align="left">
                    {enable ? <Chip label="Không hiệu lực" /> : <Chip color="primary" label="Có hiệu lực" />}
                </TableCell>

                <TableCell align="right">
                    <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>
            {ROLES?.map((role) =>
                role.name === 'ADMIN' ? (
                    <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 180 }}>


                        <MenuItem
                            onClick={() => {
                                onEditRow();
                                handleClosePopover();
                            }}
                        >
                            <Iconify icon="eva:edit-fill" />
                            Cập nhật
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleOpenConfirmResetPassword();
                                handleClosePopover();
                            }}
                        >
                            <Iconify icon="eva:refresh-outline" />
                            Reset mật khẩu
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleOpenConfirm();
                                handleClosePopover();
                            }}
                            sx={{ color: 'error.main' }}
                        >
                            <Iconify icon="eva:alert-circle-outline" />
                            {!enable ? 'Vô hiệu hóa' : 'Kích hoạt'}

                        </MenuItem>
                    </MenuPopover>
                ) : (
                    <></>
                )
            )}
            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title={!enable ? 'Vô hiệu hóa' : 'Kích hoạt'}
                content={!enable ? 'Bạn có chắc chắn vô hiệu hóa người dùng này?' : 'Bạn có chắc chắn cho phép người dùng này hoạt động?'}
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            onDeleteRow();
                            handleCloseConfirm();
                        }}
                    >
                        {!enable ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    </Button>
                }
            />
            <ConfirmDialog
                open={openConfirmResetPassword}
                onClose={handleCloseConfirmResetPassword}
                title={'Reset mật khẩu'}
                content={'Bạn có chắc chắn reset mật khẩu của người dùng này?'}
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleResetUser(id)
                            handleCloseConfirmResetPassword();
                        }}
                    >
                        Reset
                    </Button>
                }
            />
        </>
    );
}

