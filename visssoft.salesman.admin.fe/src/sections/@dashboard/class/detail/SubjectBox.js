import PropTypes from 'prop-types';
import { useCallback, useRef, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Paper, MenuItem, Typography, CardHeader, Grid, Button, Checkbox } from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
// components
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';

import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import useResponsive from '../../../../hooks/useResponsive';

import { deleteSubjectInClass } from '../../../../dataProvider/agent';
import { imageSubject } from '../../../../components/file-thumbnail';
import ConfirmDialog from '../../../../components/confirm-dialog';
// import Image from '../../../../components/image';

// ----------------------------------------------------------------------

ClassNewestBooking.propTypes = {
    sx: PropTypes.object,
    list: PropTypes.array,
    title: PropTypes.string,
    subheader: PropTypes.number,
};

export default function ClassNewestBooking({ fetchMyClass, classID, myClass, title, user, subheader, sx, ...other }) {
    const theme = useTheme();

    return (
        <Box sx={{ py: 2, ...sx }} {...other}>
            <CardHeader
                title={title}
                subheader={`${subheader} môn học`}
                sx={{
                    p: 0,
                    mb: 3,
                    '& .MuiCardHeader-action': { alignSelf: 'center' },
                }}
            />
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                {myClass?.subjects?.map((item, index) => (
                    <Grid item xs={12} sm={12} md={12} key={index}>
                        <BookingItem
                            fetchMyClass={() => fetchMyClass()}
                            classID={classID}
                            user={user}
                            key={item.subjectId}
                            item={item}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

// ----------------------------------------------------------------------

function BookingItem({ fetchMyClass, item, user, classID }) {
    const { code, name, subjectId, totalDocs, totalSlots } = item;
    const { enqueueSnackbar } = useSnackbar();
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };
    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handlerDelete = async () => {
        const res = await deleteSubjectInClass(classID, [
            {
                subjectId: item.subjectId,
            },
        ]);
        if (res.status < 400) {
            await fetchMyClass();
            enqueueSnackbar('Xoá lớp thành công');
        } else {
            enqueueSnackbar('Xoá thất bại', { variant: 'error' });
        }
    };
    const {
        query: { class_id },
    } = useRouter();

    const { push } = useRouter();
    const isDesktop = useResponsive('up', 'sm');

    const handleOnClickSubject = () => {
        const u = user?.roles.find((role) => role.name === 'ADMIN' || role.name === 'TRUONGBOMON');
        if (u != null) {
            push(
                PATH_DASHBOARD.class.subject(
                    class_id,
                    subjectId,
                    true
                )
            );
        } else {
            push(
                PATH_DASHBOARD.class.subject(
                    class_id,
                    subjectId,
                    !!item.teacher.find((teacherInSubject) => teacherInSubject.id === user.id)
                )
            );
        }
    };

    return (
        <>
            <Paper
                sx={{
                    mx: 1.5,
                    borderRadius: 2,
                    bgcolor: 'background.neutral',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Stack
                    onClick={handleOnClickSubject}
                    spacing={3}
                    sx={{ p: 1, display: 'flex', cursor: 'pointer', flexDirection: 'row' }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <img src={imageSubject(code)} width={100} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Stack direction="row" alignItems="center">
                            <div>
                                <Typography variant="subtitle2">{name}</Typography>
                            </div>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            {item?.teacher &&
                                item?.teacher.map((tc) => (
                                    <Typography variant="subtitle2">
                                        Giáo viên dạy: {tc.firstName} {tc.lastName}
                                    </Typography>
                                ))}
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={3} sx={{ color: 'text.secondary' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Iconify icon="material-symbols:edit-document" width={16} />
                                <Typography variant="caption">Số tài liệu: {totalDocs}</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={3} sx={{ color: 'text.secondary' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Iconify icon="material-symbols:edit-document" width={16} />
                                <Typography variant="caption">Số tuần: {totalSlots}</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
                <Stack sx={{ mr: 2 }} direction="row" alignItems="center" spacing={3}>
                    {item.teacher.find((teacherInSubject) => teacherInSubject.id === user.id) ? (
                        <Iconify sx={{ color: 'orange' }} icon="eva:star-fill" />
                    ) : (
                        ''
                    )}
                    {user?.roles.find((role) => role.name === 'ADMIN' || role.name === 'TRUONGBOMON') ? (
                        <Button onClick={handleOpenConfirm}>
                            <Iconify icon="eva:trash-2-outline" width={28} />
                        </Button>
                    ) : (
                        ''
                    )}
                </Stack>
            </Paper>
            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title={'Xóa môn học'}
                content={'Bạn có chắc chắn muốn xóa môn học này!'}
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handlerDelete();
                            handleCloseConfirm();
                        }}
                    >
                        {'Xóa'}
                    </Button>
                }
            />
        </>
    );
}
