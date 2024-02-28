import { paramCase } from 'change-case';
import { useEffect, useState, useCallback } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
  Box,
  Pagination,
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
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock_
import { _subjects } from '../../../_mock/arrays';
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
import { SubjectTableToolbar, SubjectTableRow } from '../../../sections/@dashboard/subject/list';
import { deleteSubject, deleteLevel, getAllSubject } from '../../../dataProvider/agent';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Mã môn học', align: 'left' },
  { id: 'name', label: 'Tên môn học', align: 'left' },
  { id: 'description', label: 'Mô tả', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

SubjectListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function SubjectListPage() {
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

  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 5,
    searchByName: '',
  });

  const { push } = useRouter();

  const [tableData, setTableData] = useState(_subjects);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [listSubjects, setListSubjects] = useState([]);

  const dataFiltered = applyFilter({
    inputData: listSubjects,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const [paging, setPaging] = useState();

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
    const response = await deleteSubject(id);
    if (response.status < 400) {
      setSelected([]);
      await fetchSubjects();
      enqueueSnackbar('Xóa môn học thành công');
    } else {
      enqueueSnackbar('Xóa môn học thất bại', { variant: 'error' });
    }
    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handlePageChange = useCallback(
    (event, pageIndex) => {
      setFilter({ ...filter, pageIndex: pageIndex });
    },
    [filter]
  );

  const handleDeleteRows = async (selected) => {
    const response = await deleteSubject(selected);
    if (response.status < 400) {
      setSelected([]);
      await fetchSubjects();
      enqueueSnackbar('Xóa khối học thành công');
    } else {
      enqueueSnackbar('Xóa môn học thất bại', { variant: 'error' });
    }

    if (page > 0) {
      if (selected.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selected.length === dataFiltered.length) {
        setPage(0);
      } else if (selected.length > dataInPage.length) {
        const newPage = Math.ceil((listSubjects.length - selected.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.subject.edit(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  useEffect(() => {
    fetchSubjects();
  }, [filter]);

  async function fetchSubjects() {
    const res = await getAllSubject(filter);
    if (res.status < 400) {
      setPaging(JSON.parse(res.headers['x-pagination']));
      setListSubjects(res.data.data);
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
          heading="Danh sách môn học"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Môn học', href: PATH_DASHBOARD.subject.root },
            { name: 'Danh sách' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.subject.new} passHref>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                Thêm môn học
              </Button>
            </NextLink>
          }
        />

        <Card>
          <Divider />

          <SubjectTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={listSubjects.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  listSubjects.map((row) => row.id)
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
                  rowCount={listSubjects.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      listSubjects.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {/* {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subject) => ( */}
                  {listSubjects?.map((subject) => (
                    <SubjectTableRow
                      key={subject.id}
                      row={subject}
                      selected={selected.includes(subject.id)}
                      onSelectRow={() => onSelectRow(subject.id)}
                      onDeleteRow={() => handleDeleteRow(subject.id)}
                      onEditRow={() => handleEditRow(subject.id)}
                    />
                  ))}

                  {/* ))} */}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, listSubjects.length)} />

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
    inputData = inputData.filter((subject) => subject.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return inputData;
}
