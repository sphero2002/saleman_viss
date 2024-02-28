import { paramCase } from 'change-case';
import { useCallback, useEffect, useState } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
    Tab,
    Tabs,
    Card,
    Table,
    Button,
    Tooltip,
    Divider,
    TableBody,
    Container,
    IconButton,
    TableContainer,
    TablePagination,
    Pagination,
    Box,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock_
import { _userList } from '../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from '../../../components/table';
// sections
import { UserTableToolbar, UserTableRow } from '../../../sections/@dashboard/user/list';
import { deleteUser, getAllPermission, getALlRoles, getAllUsers } from '../../../dataProvider/agent';
import { useSnackbar } from '../../../components/snackbar';
import error from 'eslint-plugin-react/lib/util/error';
import Label from '../../../components/label';
import FileNewUserDialog from '../../../sections/@dashboard/file/portal/FileNewUsersDialog';
import { useMemo } from 'react';
import { useAuthContext } from '../../../auth/useAuthContext';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'username', label: 'Tài khoản', align: 'left' },
    { id: 'name', label: 'Họ Tên', align: 'left' },
    { id: 'gender', label: 'Giới tính', align: 'left' },
    { id: 'birthdate', label: 'Sinh nhật', align: 'left' },
    { id: 'email', label: 'Email', align: 'left' },
    { id: 'phone', label: 'SĐT', align: 'left' },
    { id: 'address', label: 'Địa chỉ', align: 'left' },
    { id: 'role', label: 'Vai trò', align: 'left' },
    { id: 'status', label: 'Trạng thái', align: 'left' },
    { id: '' },
];

// ----------------------------------------------------------------------

UserListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function UserListPage() {
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

    const [initData, setInitData] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    const { push } = useRouter();

    const { user } = useAuthContext();

    const [filter, setFilter] = useState({
        pageIndex: 1,
        pageSize: 5,
        searchByEmail: '',
        roleId: '',
    });

    const [openConfirm, setOpenConfirm] = useState(false);

    const [filterName, setFilterName] = useState('');

    const [filterRole, setFilterRole] = useState('all');

    const [userRole, setUserRole] = useState([]);

    const [filterStatus, setFilterStatus] = useState(-1);

    const [openUploadFile, setOpenUploadFile] = useState(false);

    const [paging, setPaging] = useState();

    const [listUsers, setListUsers] = useState([]);

    const [role, setSelectedRole] = useState('all');

    const [filterByEmail, setFilterByEmail] = useState('');

    const denseHeight = dense ? 52 : 72;

    const getLengthByStatus = (status) => listUsers?.filter((user) => user.enable === status).length;

    const handleOpenUploadFile = () => {
        setOpenUploadFile(true);
    };

    const handleCloseUploadFile = () => {
        setOpenUploadFile(false);
    };

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const [isSearching, setIsSearching] = useState(false);

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleFilterRole = (event) => {
        setPage(0);
        setFilterRole(event.target.value);
    };

    const handleDeleteRow = async (id) => {
        const res = await deleteUser(id);
        if (res.status < 400) {
            setSelected([]);
            await fetchUsers(filter);
            enqueueSnackbar('Vô hiệu hóa/Kích hoạt người dùng thành công');
        } else {
            enqueueSnackbar('Vô hiệu hóa/Kích hoạt người dùng thất bại', { variant: 'error' });
        }
    };

    const handleDeleteRows = async (selected) => {
        const deleteRows = await deleteUser(selected);
        if (deleteRows.status < 400) {
            setSelected([]);
            await fetchUsers(filter);
            enqueueSnackbar('Vô hiệu hóa/Kích hoạt người dùng thành công');
        } else {
            enqueueSnackbar('Vô hiệu hóa/Kích hoạt người dùng thất bại', { variant: 'error' });
        }
    };

    const handleEditRow = (id) => {
        push(PATH_DASHBOARD.user.edit(id));
    };

    async function fetchRoles() {
        const res = await getALlRoles({ pageIndex: 1, pageSize: 10 });
        if (res.status < 400) {
            const transformData = res.data.data.map((tag) => {
                return {
                    label: tag.name,
                    id: tag.id,
                };
            });

            setUserRole(transformData);
        } else {
            return error;
        }
    }

    const handlePageChange = useCallback(
        (event, pageIndex) => {
            setFilter({ ...filter, pageIndex: pageIndex });
        },
        [filter]
    );

    const handleChangeFilterByEmail = useCallback(
        (event) => {
            setFilter({ ...filter, searchByEmail: event.target.value });
        },
        [filter]
    );

    const handleChangeRoles = (event) => {
        console.log('event.target.value', event.target.value);
        setFilter({ ...filter, roleId: event.target.value === 'all' ? '' : event.target.value });
        setSelectedRole(event.target.value);
    };


    const handleResetFilter = () => {
        setSelectedRole('all');
        setFilterByEmail('');
        setIsSearching(false);
    };

    async function fetchUsers() {
        const res = await getAllUsers(filter);
        if (res.status < 400) {
            setPaging(JSON.parse(res.headers['x-pagination']));
            setListUsers(res.data.data); 
        } else {
            console.log(res.message);
        }
    }
    useEffect(() => {
        fetchUsers();
    }, [filter]);

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>

            <Container maxWidth={'xl'}>
                {user?.roles.find((role) => role.name === 'ADMIN') ? (

                    <CustomBreadcrumbs
                        heading="Danh sách người dùng"
                        links={[{ name: 'Trang chủ', href: PATH_DASHBOARD.root }, { name: 'Danh sách người dùng' }]}
                        action={
                            <NextLink href={PATH_DASHBOARD.user.new} passHref>
                                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                    Thêm nguời dùng
                                </Button>
                            </NextLink>
                        }
                        action2={
                            <Button
                                variant="contained"
                                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                                onClick={handleOpenUploadFile}
                            >
                                Import danh sách
                            </Button>
                        }
                    />
                ) : (
                    <CustomBreadcrumbs
                        heading="Danh sách người dùng"
                        links={[{ name: 'Trang chủ', href: PATH_DASHBOARD.root }, { name: 'Danh sách người dùng' }]}
                    />

                )}

                <Card>
                    <Divider />

                    <UserTableToolbar
                        onChangeRoles={handleChangeRoles}
                        selectedRole={role}
                        onChangeFilterByEmail={handleChangeFilterByEmail}
                        filterByEmail={filterByEmail}
                        isFiltered={isSearching}
                        filterName={filterName}
                        filterRole={filterRole}
                        optionsRole={userRole}
                        onFilterName={handleFilterName}
                        onFilterRole={handleFilterRole}
                        onResetFilter={handleResetFilter}
                    />

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={selected.length}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    listUsers.map((row) => row.id)
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={handleOpenConfirm}>
                                        <Iconify icon="eva:trash-2-outline" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />

                        <Scrollbar>
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={listUsers?.length}
                                    numSelected={selected.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            listUsers.map((row) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {/* listUsers */}
                                    {listUsers.map((user) => (
                                        <UserTableRow
                                            key={user.id}
                                            data={user}
                                            selected={selected.includes(user.id)}
                                            onSelectRow={() => onSelectRow(user.id)}
                                            onDeleteRow={() => handleDeleteRow(user.id)}
                                            onEditRow={() => handleEditRow(user.id)}
                                        />
                                    ))}

                                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, listUsers?.length)} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <Box p={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div></div>
                        <Pagination
                            size="small"
                            count={paging?.TotalPages}
                            rowsperpage={paging?.PageSize}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </Card>
            </Container>
            <FileNewUserDialog open={openUploadFile} onClose={handleCloseUploadFile} />
            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Xóa"
                content={<>Bạn có chắc chắn muốn xóa người dùng này?</>}
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteRows(selected);
                            handleCloseConfirm();
                        }}
                    >
                        Xóa
                    </Button>
                }
            />
        </>
    );
}
