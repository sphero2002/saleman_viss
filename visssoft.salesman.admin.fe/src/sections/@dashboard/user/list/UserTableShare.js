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

UserTableShare.propTypes = {
    row: PropTypes.array,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
};

export default function UserTableShare({ data, selected, onEditRow, onSelectRow, onDeleteRow }) {
    const { id, firstName, lastName, email, roles, gender, phone, address, birthDate, enable } = data;

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
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>
                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                            {`${firstName} ${lastName}`}
                        </Typography>
                    </Stack>
                </TableCell>
                <TableCell align="left">{email}</TableCell>
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
            </TableRow>
        </>
    );
}

