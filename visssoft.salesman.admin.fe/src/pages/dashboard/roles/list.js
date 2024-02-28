import { useCallback, useEffect, useState } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    IconButton,
    Pagination,
    Table,
    TableBody,
    TableContainer,
    Tooltip,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock_
import { _typeDocumentList } from '../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
    emptyRows,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableNoData,
    TableSelectedAction,
    useTable,
} from '../../../components/table';
// sections
import { RoleTableRow, RoleTableToolbar } from '../../../sections/@dashboard/roles/list';
import { deleteRole, getALlRoles } from '../../../dataProvider/agent';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Tên vai trò', align: 'left' },
    { id: 'description', label: 'Mô tả', align: 'left' },
    { id: 'createDate', label: 'Ngày tạo', align: 'left' },
    { id: '' },
];

// ----------------------------------------------------------------------

RolesListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function RolesListPage() {
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

    const { enqueueSnackbar } = useSnackbar();

    const { themeStretch } = useSettingsContext();

    const { push } = useRouter();

    const [tableData, setTableData] = useState(_typeDocumentList);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [filterName, setFilterName] = useState('');

    const [listRoles, setListRoles] = useState([]);

    const dataFiltered = applyFilter({
        inputData: listRoles,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const denseHeight = dense ? 52 : 72;

    const isFiltered = filterName !== '';

    const isNotFound = !dataFiltered.length && !!filterName;
    const [paging, setPaging] = useState();
    const [filter, setFilter] = useState({
        pageIndex: 1,
        pageSize: 10,
        searchByName: '',
    });

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleFilterName = useCallback(
        (event) => {
            setFilter({ ...filter, searchByName: event.target.value });
        },
        [filter]
    );

    const handleDeleteRow = async (id) => {
        const response = await deleteRole(id);
        if (response.status < 400) {
            setSelected([]);
            await fetchRoles();
            enqueueSnackbar('Xóa vai trò thành công');
        } else {
            enqueueSnackbar('Xóa vai trò thất bại');
        }

        if (page > 0) {
            if (dataInPage.length < 2) {
                setPage(page - 1);
            }
        }
    };

    const handleDeleteRows = async (selected) => {
        const response = await deleteRole(selected);
        if (response.status < 400) {
            setSelected([]);
            await fetchRoles();
            enqueueSnackbar('Xóa vai trò thành công');
        } else {
            enqueueSnackbar('Xóa vai trò thất bại');
        }

        if (page > 0) {
            if (selected.length === dataInPage.length) {
                setPage(page - 1);
            } else if (selected.length === dataFiltered.length) {
                setPage(0);
            } else if (selected.length > dataInPage.length) {
                const newPage = Math.ceil((listRoles.length - selected.length) / rowsPerPage) - 1;
                setPage(newPage);
            }
        }
    };

    const handlePageChange = useCallback(
        (event, pageIndex) => {
            setFilter({ ...filter, pageIndex: pageIndex });
        },
        [filter]
    );
    const handleEditRow = (id) => {
        push(PATH_DASHBOARD.role.edit(id));
    };

    const handleResetFilter = () => {
        setFilterName('');
    };

    async function fetchRoles() {
        const res = await getALlRoles(filter);
        console.log(res);
        if (res.status < 400) {
            setPaging(JSON.parse(res.headers['x-pagination']));
            setListRoles(res.data.data);
        } else {
            console.log(res.message);
        }
    }
    useEffect(() => {
        fetchRoles();
    }, [filter]);

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>

            <Container maxWidth={'xl'}>
                <CustomBreadcrumbs
                    heading="Danh sách vai trò"
                    links={[
                        { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                        { name: 'Vai trò', href: PATH_DASHBOARD.role.root },
                        { name: 'Danh sách' },
                    ]}
                    action={
                        <NextLink href={PATH_DASHBOARD.role.new} passHref>
                            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                Thêm vai trò
                            </Button>
                        </NextLink>
                    }
                />

                <Card>
                    <Divider />

                    <RoleTableToolbar
                        isFiltered={isFiltered}
                        filterName={filterName}
                        onFilterName={handleFilterName}
                        onResetFilter={handleResetFilter}
                    />

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={listRoles.length}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    listRoles.map((row) => row.id)
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
                                    rowCount={listRoles.length}
                                    numSelected={selected.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            listRoles.map((row) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {/* {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((roles) => ( */}
                                    {listRoles?.map((roles) => (
                                        <RoleTableRow
                                            key={roles.id}
                                            row={roles}
                                            selected={selected.includes(roles.id)}
                                            onSelectRow={() => onSelectRow(roles.id)}
                                            onDeleteRow={() => handleDeleteRow(roles.id)}
                                            onEditRow={() => handleEditRow(roles.id)}
                                        />
                                    ))}

                                    {/* ))} */}

                                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, listRoles.length)} />

                                    <TableNoData isNotFound={isNotFound} />
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

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Xóa"
                content={
                    <>
                        Bạn có chắc chắn muốn xóa <strong> {selected.length} </strong>?
                    </>
                }
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

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        inputData = inputData.filter((roles) => roles.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
    }

    return inputData;
}
