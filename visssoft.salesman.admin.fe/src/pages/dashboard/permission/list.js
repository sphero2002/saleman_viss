import { useCallback, useEffect, useState } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
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
import { PermissionTableRow, PermissionTableToolbar } from '../../../sections/@dashboard/permission/list';
import { deletePermission, getAllPermission } from '../../../dataProvider/agent';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Tên quyền', align: 'left' },
    { id: 'description', label: 'Mô tả', align: 'left' },
    { id: 'createDate', label: 'Ngày tạo', align: 'left' },
    { id: '' },
];

// ----------------------------------------------------------------------

PermissionListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PermissionListPage() {
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

    const [listPermission, setListPermission] = useState([]);

    const [paging, setPaging] = useState();

    const [filter, setFilter] = useState({
        pageIndex: 1,
        pageSize: 5,
        searchByName: '',
    });

    const dataFiltered = applyFilter({
        inputData: listPermission,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const denseHeight = dense ? 52 : 72;

    const isFiltered = filterName !== '';

    const isNotFound = !dataFiltered.length && !!filterName;

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleFilterStatus = (event, newValue) => {
        setPage(0);
        setFilterStatus(newValue);
    };
    const handleFilterName = useCallback(
        (event) => {
            setFilter({ ...filter, searchByName: event.target.value });
        },
        [filter]
    );

    const handlePageChange = useCallback(
        (event, pageIndex) => {
            setFilter({ ...filter, pageIndex: pageIndex });
        },
        [filter]
    );

    const handleEditRow = (id) => {
        push(PATH_DASHBOARD.permission.edit(id));
    };

    const handleResetFilter = () => {
        setFilterName('');
    };

    async function fetchPermission() {
        const res = await getAllPermission(filter);
        console.log(res.data);
        if (res.status < 400) {
            setPaging(JSON.parse(res.headers['x-pagination']));
            setListPermission(res.data.data);
        } else {
            console.log(res.message);
        }
    }

    useEffect(() => {
        fetchPermission();
    }, [filter]);
    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>

            <Container maxWidth={'xl'}>
                <CustomBreadcrumbs
                    heading="Danh sách quyền"
                    links={[
                        { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                        { name: 'Quyền', href: PATH_DASHBOARD.permission.root },
                        { name: 'Danh sách' },
                    ]}

                    action={
                        <NextLink href={PATH_DASHBOARD.permission.new} passHref>
                            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                Thêm Quyền
                            </Button>
                        </NextLink>
                    }
                />

                <Card>
                    <Divider />

                    <PermissionTableToolbar
                        isFiltered={isFiltered}
                        filterName={filterName}
                        onFilterName={handleFilterName}
                        onResetFilter={handleResetFilter}
                    />

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={listPermission.length}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    listPermission.map((row) => row.id)
                                )
                            }
                        />

                        <Scrollbar>
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={listPermission.length}
                                    numSelected={selected.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            listPermission.map((row) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {/* {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((perm) => ( */}
                                    {listPermission?.map((perm) => (
                                        <PermissionTableRow
                                            key={perm.id}
                                            row={perm}
                                            selected={selected.includes(perm.id)}
                                            onSelectRow={() => onSelectRow(perm.id)}
                                            onEditRow={() => handleEditRow(perm.id)}
                                        />
                                    ))}

                                    {/* ))} */}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(page, rowsPerPage, listPermission.length)}
                                    />

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
        inputData = inputData.filter((perm) => perm.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
    }

    return inputData;
}
