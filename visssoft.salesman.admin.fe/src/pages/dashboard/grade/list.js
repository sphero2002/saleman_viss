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
import { _gradeList } from '../../../_mock/arrays';
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
import { GradeTableToolbar, GradeTableRow } from '../../../sections/@dashboard/grade/list';
import { deleteGrade, deleteLevel, getAllGrade, getAllLevel } from '../../../dataProvider/agent';
import { useSnackbar } from '../../../components/snackbar';
import Label from '../../../components/label';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên khối học', align: 'left' },
  { id: 'description', label: 'Mô tả', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

GradeListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GradeListPage() {
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

  const [tableData, setTableData] = useState(_gradeList);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterLevel, setFilterLevel] = useState('all');

  const [listGrades, setListGrades] = useState([]);

  const [listLevels, setListLevels] = useState([]);

  const dataFiltered = applyFilter({
    inputData: listGrades,
    comparator: getComparator(order, orderBy),
    filterName,
    filterLevel,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '';
  const [paging, setPaging] = useState();

  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 5,
    searchByName: '',
    levelId: '',
  });

  const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterLevel);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterLevel = useCallback(
    (event, newValue) => {
      setFilter({ ...filter, levelId: newValue === 'all' ? '' : newValue });
      setFilterLevel(newValue);
    },
    [filter]
  );

  const handleFilterName = useCallback(
    (event) => {
      setFilter({ ...filter, searchByName: event.target.value });
    },
    [filter]
  );

  const handleDeleteRow = async (id) => {
    const response = await deleteGrade(id);
    if (response.status < 400) {
      setSelected([]);
      await fetchGrades();
      enqueueSnackbar('Xóa khối học thành công');
    } else {
      enqueueSnackbar('Xóa khối học thất bại', { variant: 'error' });
    }

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = async (selected) => {
    const response = await deleteGrade(selected);
    if (response.status < 400) {
      setSelected([]);
      await fetchGrades();
      enqueueSnackbar('Xóa khối học thành công');
    } else {
      enqueueSnackbar('Xóa khối học thất bại', { variant: 'error' });
    }

    if (page > 0) {
      if (selected.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selected.length === dataFiltered.length) {
        setPage(0);
      } else if (selected.length > dataInPage.length) {
        const newPage = Math.ceil((listGrades.length - selected.length) / rowsPerPage) - 1;
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
    push(PATH_DASHBOARD.grade.edit(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterLevel('all');
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [filter]);

  async function fetchLevels() {
    const res = await getAllLevel({ pageIndex: 1, pageSize: 100 });
    if (res.status < 400) {
      setListLevels(res.data.data);
    } else {
      console.log(res.message);
    }
  }

  async function fetchGrades() {
    const res = await getAllGrade(filter);
    if (res.status < 400) {
      setPaging(JSON.parse(res.headers['x-pagination']));
      setListGrades(res.data.data);
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
          heading="Danh sách khối học"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Khối học', href: PATH_DASHBOARD.grade.root },
            { name: 'Danh sách' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.grade.new} passHref>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                Thêm khối học
              </Button>
            </NextLink>
          }
        />

        <Card>
          <Tabs
            value={filterLevel}
            onChange={handleFilterLevel}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            <Tab key="all" label="Tất cả" value="all" />
            {listLevels.map((tab) => (
              <Tab key={tab.id} label={tab.name} value={tab.id} />
            ))}
          </Tabs>

          <Divider />

          <GradeTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={listGrades.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  listGrades.map((row) => row.id)
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
                  rowCount={listGrades.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      listGrades.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {/* {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((grade) => ( */}
                  {listGrades?.map((grade) => (
                    <GradeTableRow
                      key={grade.id}
                      row={grade}
                      selected={selected.includes(grade.id)}
                      onSelectRow={() => onSelectRow(grade.id)}
                      onDeleteRow={() => handleDeleteRow(grade.id)}
                      onEditRow={() => handleEditRow(grade.id)}
                    />
                  ))}

                  {/* ))} */}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, listGrades.length)} />
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

function applyFilter({ inputData, comparator, filterName, filterLevel }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((grade) => grade.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterLevel !== 'all') {
    inputData = inputData.filter((grade) => grade.levelId === filterLevel);
  }

  return inputData;
}
