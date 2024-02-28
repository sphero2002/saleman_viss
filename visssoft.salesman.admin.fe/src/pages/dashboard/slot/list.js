import { paramCase } from 'change-case';
import { useEffect, useState, useCallback } from 'react';
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
    Box,
    Pagination,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock_
import { _slot } from '../../../_mock/arrays';
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
import { SlotTableToolbar, SlotTableRow } from '../../../sections/@dashboard/slot/list';
import { deleteSlot, deleteProgram, getAllSlot, getAllGrade } from '../../../dataProvider/agent';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Tên tiết học', align: 'left' },
    { id: 'createDate', label: 'Ngày tạo', align: 'left' },
    { id: '' },
];

// ----------------------------------------------------------------------

SlotListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function SlotListPage() {
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

    const [tableData, setTableData] = useState(_slot);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [filterName, setFilterName] = useState('');

    const [listSlots, setListSlots] = useState([]);

    const dataFiltered = applyFilter({
        inputData: listSlots,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const [paging, setPaging] = useState();

    const [filter, setFilter] = useState({
        pageIndex: 1,
        pageSize: 5,
        searchByName: '',
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
    const handleDeleteRow = async (id) => {
        const response = await deleteSlot(id);
        if (response.status < 400) {
            setSelected([]);
            await fetchSlots();
            enqueueSnackbar('Xóa tuần học thành công');
        } else {
            enqueueSnackbar('Xóa tuần học thất bại', { variant: 'error' });
        }

        if (page > 0) {
            if (dataInPage.length < 2) {
                setPage(page - 1);
            }
        }
    };

    const handleDeleteRows = async (selected) => {
        const response = await deleteSlot(selected);
        if (response.status < 400) {
            setSelected([]);
            await fetchSlots();
            enqueueSnackbar('Xóa tuần học thành công');
        } else {
            enqueueSnackbar('Xóa tuần học thất bại', { variant: 'error' });
        }

        if (page > 0) {
            if (selected.length === dataInPage.length) {
                setPage(page - 1);
            } else if (selected.length === dataFiltered.length) {
                setPage(0);
            } else if (selected.length > dataInPage.length) {
                const newPage = Math.ceil((listSlots.length - selected.length) / rowsPerPage) - 1;
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
        push(PATH_DASHBOARD.slot.edit(id));
    };

    const handleResetFilter = () => {
        setFilterName('');
    };

    useEffect(() => {
        fetchSlots();
    }, [filter]);

    async function fetchSlots() {
        const res = await getAllSlot(filter);
        if (res.status < 400) {
            setPaging(JSON.parse(res.headers['x-pagination']));
            setListSlots(res.data.data);
        } else {
            console.log(res.message);
        }
    }

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>

            <Container maxWidth={'xl'}>
                <CustomBreadcrumbs
                    heading="Danh sách tuần học"
                    links={[
                        { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                        { name: 'Tuần học', href: PATH_DASHBOARD.slot.root },
                        { name: 'Danh sách' },
                    ]}
                    action={
                        <NextLink href={PATH_DASHBOARD.slot.new} passHref>
                            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                Thêm tiết học
                            </Button>
                        </NextLink>
                    }
                />

                <Card>
                    <Divider />

                    <SlotTableToolbar
                        isFiltered={isFiltered}
                        filterName={filterName}
                        onFilterName={handleFilterName}
                        onResetFilter={handleResetFilter}
                    />

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={listSlots.length}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    listSlots.map((row) => row.id)
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
                                    rowCount={listSlots.length}
                                    numSelected={selected.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            listSlots.map((row) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {/* {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((slot) => ( */}
                                    {listSlots?.map((slot) => (
                                        <SlotTableRow
                                            key={slot.id}
                                            row={slot}
                                            selected={selected.includes(slot.id)}
                                            onSelectRow={() => onSelectRow(slot.id)}
                                            onDeleteRow={() => handleDeleteRow(slot.id)}
                                            onEditRow={() => handleEditRow(slot.id)}
                                        />
                                    ))}

                                    {/* ))} */}

                                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, listSlots.length)} />

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
        inputData = inputData.filter((slot) => slot.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
    }

    return inputData;
}
