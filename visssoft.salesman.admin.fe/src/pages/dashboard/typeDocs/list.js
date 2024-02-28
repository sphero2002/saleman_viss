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

import { useSnackbar } from '../../../components/snackbar';
import {
  deleteTypeDocument,
  getALlRoles,
  getAllSubject,
  getAllTypeDocument,
  removeTypeDocumentToSubject,
} from '../../../dataProvider/agent';
import { TypeDocsTableRow, TypeDocsTableToolbar } from '../../../sections/@dashboard/typeDocs/list';
import error from 'eslint-plugin-react/lib/util/error';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên loại tài liệu', align: 'left' },
  { id: 'description', label: 'Ngày tạo', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

TypeDocsListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function TypeDocsListPage() {
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
    subjectId: '',
    searchByName: '',
  });

  const { push } = useRouter();

  const [tableData, setTableData] = useState(_typeDocumentList);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [listTypeDocuments, setListTypeDocuments] = useState([]);

  const [userSubject, setUserSubject] = useState([]);

  const [subject, setSelectedSubject] = useState('all');

  const [moreAction, setMoreAction] = useState(true);

  const dataFiltered = applyFilter({
    inputData: listTypeDocuments,
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

  const handleFilterName = useCallback(
    (event) => {
      setFilter({ ...filter, searchByName: event.target.value });
    },
    [filter]
  );

  const handleDeleteRow = async (id) => {
    const response = await deleteTypeDocument(id);
    if (response.status < 400) {
      setSelected([]);
      await fetchTypeDocuments();
      enqueueSnackbar('Xóa loại tài liệu thành công');
    } else {
      enqueueSnackbar('Xóa loại tài liệu thất bại', { variant: 'error' });
    }
    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleChangeSubjects = (event) => {
    console.log('event.target.value', event.target.value);
    setFilter({ ...filter, subjectId: event.target.value === 'all' ? '' : event.target.value });
    setSelectedSubject(event.target.value);
    setMoreAction(event.target.value === 'all');
  };

  const handleRemoveTypeFromSubject = async (id) => {
    console.log('data', id, subject);
    const response = await removeTypeDocumentToSubject(id, subject);
    console.log(response);
    if (response.status < 400) {
      setSelected([]);
      await fetchTypeDocuments();
      enqueueSnackbar('Gỡ loại tài liệu khỏi môn học thành công');
    } else {
      enqueueSnackbar('Gỡ loại tài liệu khỏi môn học thất bại', { variant: 'error' });
    }
  };

  const handlePageChange = (event, newPage) => {
    fetchTypeDocuments({ ...filter, pageIndex: newPage });
  };

  const handleDeleteRows = async (selected) => {
    const response = await deleteTypeDocument(selected);
    if (response.status < 400) {
      setSelected([]);
      await fetchTypeDocuments();
      enqueueSnackbar('Xóa loại tài liệu thành công');
    } else {
      enqueueSnackbar('Xóa loại tài liệu thất bại', { variant: 'error' });
    }

    if (page > 0) {
      if (selected.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selected.length === dataFiltered.length) {
        setPage(0);
      } else if (selected.length > dataInPage.length) {
        const newPage = Math.ceil((listTypeDocuments.length - selected.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  async function fetchSubjects() {
    const res = await getAllSubject({ pageIndex: 1, pageSize: 150 });
    if (res.status < 400) {
      const transformData = res.data.data.map((tag) => {
        return {
          label: tag.name,
          id: tag.id,
        };
      });

      setUserSubject(transformData);
    } else {
      return error;
    }
  }

  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.type_documents.edit(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  useEffect(() => {
    fetchTypeDocuments();
  }, [filter]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchTypeDocuments() {
    const res = await getAllTypeDocument(filter);
    if (res.status < 400) {
      setPaging(JSON.parse(res.headers['x-pagination']));
      setListTypeDocuments(res.data.data);
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
          heading="Danh sách loại tài liệu"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Loại tài liệu', href: PATH_DASHBOARD.type_documents.root },
            { name: 'Danh sách' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.type_documents.new} passHref>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                Thêm loại tài liệu
              </Button>
            </NextLink>
          }
        />

        <Card>
          <Divider />

          <TypeDocsTableToolbar
            onChangeSubjects={handleChangeSubjects}
            selectedSubject={subject}
            optionsSubject={userSubject}
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={listTypeDocuments.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  listTypeDocuments.map((row) => row.id)
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
                  rowCount={listTypeDocuments.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      listTypeDocuments.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {listTypeDocuments?.map((types) => (
                    <TypeDocsTableRow
                      key={types.id}
                      row={types}
                      typeId={types.id}
                      selected={selected.includes(types.id)}
                      onSelectRow={() => onSelectRow(types.id)}
                      onDeleteRow={() => handleDeleteRow(types.id)}
                      onRemoveTypeFromSubject={() => handleRemoveTypeFromSubject(types.id)}
                      onEditRow={() => handleEditRow(types.id)}
                      moreAction={moreAction}
                    />
                  ))}

                  {/* ))} */}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, listTypeDocuments.length)}
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
    inputData = inputData.filter((types) => types.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return inputData;
}
