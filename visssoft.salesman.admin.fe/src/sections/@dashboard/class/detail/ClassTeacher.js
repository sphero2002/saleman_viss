import PropTypes from 'prop-types';
import { useState } from 'react';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Card,
    Stack,
    Table,
    Avatar,
    Button,
    Divider,
    MenuItem,
    TableRow,
    TableBody,
    TableCell,
    CardHeader,
    Typography,
    IconButton,
    TableContainer,
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import MenuPopover from '../../../../components/menu-popover';
import { getComparator, TableHeadCustom, TablePaginationCustom, useTable } from '../../../../components/table';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useSnackbar } from '../../../../components/snackbar';
import { removeMemberInClass } from '../../../../dataProvider/agent';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { ROLES_CODE } from "../../../../config";

// ----------------------------------------------------------------------

ClassTeacher.propTypes = {
    title: PropTypes.string,
    tableData: PropTypes.array,
    subheader: PropTypes.string,
    tableLabels: PropTypes.array,
};

export default function ClassTeacher({
    classID,
    fetchMyClass,
    myClass,
    user,
    title,
    subheader,
    tableLabels,
    tableData,
    ...other
}) {
    const {
        query: { myclass_id },
    } = useRouter();

    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable();

    const { push } = useRouter();

    const handleOnClickSubject = () => {
        push(PATH_DASHBOARD.myclass.addMember(myclass_id));
    };

    const dataFiltered = applyFilter({
        inputData: myClass?.members?.filter((object) =>
            object?.roleInClasses?.find((roleInClass) => roleInClass.role === 'TRUONGBOMON' ||roleInClass.role === 'GVCHUNHIEM' || roleInClass.role === 'GIAOVIEN')
        ),
        comparator: getComparator(order, orderBy),
    });

    const countMemberIsTeacher = (data) => {
        let countTeacher = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].roleInClasses[0].role === 'GVCHUNHIEM' || data[i].roleInClasses[0].role === 'GIAOVIEN' || data[i].roleInClasses[0].role === 'TRUONGBOMON') {
                countTeacher++;
            }
        }
        return countTeacher;
    };

    return (
        <Card {...other}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <CardHeader sx={{ display: 'contents' }} title={title} subheader={subheader} />
            </Box>

            <TableContainer sx={{ overflow: 'unset' }}>
                <Scrollbar>
                    <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                        <TableHeadCustom order={order} orderBy={orderBy} headLabel={tableLabels} />

                        <TableBody>
                            {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <BookingDetailsRow
                                    fetchMyClass={() => fetchMyClass()}
                                    user={user}
                                    classID={classID}
                                    key={index}
                                    row={row}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>
            <TablePaginationCustom
                labelRowsPerPage="Hàng trên mỗi trang"
                count={countMemberIsTeacher(myClass?.members)}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                //
                dense={dense}
                onChangeDense={onChangeDense}
            />
            <Divider />
        </Card>
    );
}

// ----------------------------------------------------------------------

function BookingDetailsRow({ row, user, classID, fetchMyClass }) {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    const [openConfirm, setOpenConfirm] = useState(false);

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handlerDelete = async () => {
        const res = await removeMemberInClass(classID, [
            {
                userId: row.id,
            },
        ]);
        if (res.status < 400) {
            await fetchMyClass();
            handleClosePopover();
            enqueueSnackbar(`Xoá người dùng thành công`);
        } else {
            enqueueSnackbar(`Xoá thất bại, ${res?.response.data.title}`, { variant: 'error' });
        }
    };
    const isLight = theme.palette.mode === 'light';

    const [openPopover, setOpenPopover] = useState(null);

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    const handleDelete = () => {
        handleClosePopover();
        console.log('DELETE', row.subject);
    };

    return (
        <>
            {row?.roleInClasses?.map((role) =>
                role.role === 'TRUONGBOMON' || role.role === 'GVCHUNHIEM' || role.role === 'GIAOVIEN' ? (
                    <TableRow>
                        <TableCell>
                            <Stack direction="row" alignItems="center">
                                <Avatar
                                    src={window.location.origin + `/assets/images/avatars/avatar_${(1 - row.gender) * 10 + (row.id % 10) + 1
                                        }.jpg`}
                                />
                                <Typography variant="subtitle2">{row.name}</Typography>
                            </Stack>
                        </TableCell>

                        <TableCell>
                            {row.firstName} {row.lastName}
                        </TableCell>
                        <TableCell>
                            {role.role === null || '' ? (
                                <Label></Label>
                            ) : (
                                <Label key={role.id} variant="soft" color={'success'} sx={{ textTransform: 'capitalize' }}>
                                    {role.role}
                                </Label>
                            )}
                        </TableCell>

                        <TableCell>
                            {role?.subject?.map((su) => (su.name === null || '' ? <Label></Label> : <Label>{su.name}</Label>))}
                        </TableCell>

                        <TableCell>{row.email}</TableCell>

                        <TableCell>
                            {row.gender === 0 ? (
                                <Typography variant="subtitle2">Nam</Typography>
                            ) : (
                                <Typography variant="subtitle2">Nữ</Typography>
                            )}
                        </TableCell>

                        {/* <TableCell sx={{ textTransform: 'capitalize' }}>{row.roomType}</TableCell> */}

                        <TableCell align="right">
                            <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                                <Iconify icon="eva:more-vertical-fill" />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ) : (
                    ''
                )
            )}

            {user?.roles.find((role) => role.name === 'ADMIN' || role.name === 'GVCHUNHIEM' || role.name === 'TRUONGBOMON') ? (
                <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <MenuItem onClick={handleOpenConfirm} sx={{ color: 'error.main' }}>
                        <Iconify icon="eva:trash-2-outline" />
                        Xóa
                    </MenuItem>
                </MenuPopover>
            ) : (
                ''
            )}
            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title={'Xóa thành viên'}
                content={'Bạn có chắc chắn muốn xóa thành viên này!'}
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

function applyFilter({ inputData, comparator }) {
    const stabilizedThis = inputData?.map((el, index) => [el, index]);

    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis?.map((el) => el[0]);

    return inputData;
}
