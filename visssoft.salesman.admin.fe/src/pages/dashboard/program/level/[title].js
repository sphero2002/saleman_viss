import { useEffect, useCallback, useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import {
  Alert,
  Pagination,
  Button,
  Container,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  InputAdornment,
  Card,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import Markdown from '../../../../components/markdown';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
//
import LevelFirst from '../../../../sections/@dashboard/program/level/LevelFirst';
import LevelSecond from '../../../../sections/@dashboard/program/level/LevelSecond';
import Head from 'next/head';
import Iconify from '../../../../components/iconify';
// api
import {getAllDocument, getAllTypeDocument, getAllSubject, getProgramById} from '../../../../dataProvider/agent';
import { DocumentPostCard } from '../../../../sections/@dashboard/documents';

import { useAuthContext } from 'src/auth/useAuthContext';
import { use } from 'i18next';
// ----------------------------------------------------------------------

LevelLayout.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function LevelLayout() {
  const { themeStretch } = useSettingsContext();

  const { user } = useAuthContext();
  const {
    query: { title },
  } = useRouter();

  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 8,
    programId: title,
    searchByName: '',
    typeDocumentId: '',
    subjectId: '',
  });

  const [program, setProgram] = useState([])

  const renderMenuItem = useCallback((item) => {
    if (item && item.length) {
      return item.map((obj, index) => (
        <MenuItem value={obj} key={index}>
          {obj.name}
        </MenuItem>
      ));
    }
    return (
      <MenuItem>
        <Alert severity="error">This is an error !</Alert>
      </MenuItem>
    );
  });

  const [documents, setDocuments] = useState([]);
  const [typeDocs, setTypeDoc] = useState([]);
  // const [subjects, setSubject] = useState([]);
  const [paging, setPaging] = useState();

  async function fetchAllDocument() {
    const res = await getAllDocument(filter);
    if (res.status < 400) {
      setDocuments(res.data.data);
      setPaging(JSON.parse(res.headers['x-pagination']));
    } else {
      console.log(res.message);
    }
  }
  async function fetchAllTypeDoc() {
    const res = await getAllTypeDocument({
      pageIndex: 1,
      pageSize: 100,
    });
    if (res.status < 400) {
      setTypeDoc(res.data.data);
    } else {
      console.log(res.message);
    }
  }
  async function fetchProgram() {
    const res = await getProgramById(title);
    if (res.status < 400) {
      setProgram(res.data.data);
    } else {
      console.log(res.message);
    }
  }

  const handleSearchChange = useCallback(
    (event, value) => {
      setFilter({ ...filter, searchByName: event.target.value });
    },
    [filter]
  );

  const handleFilterDocType = useCallback(
    (event, value) => {
      setFilter({ ...filter, typeDocumentId: event.target.value.id });
    },
    [filter]
  );

  const handleFilterSubject = useCallback(
    (event, value) => {
      setFilter({ ...filter, subjectId: event.target.value.id });
      console.log('handleFilterSubject: ', event.target.value.id);
    },
    [filter]
  );

  const handlePageChange = useCallback(
    (event, pageIndex) => {
      setFilter({ ...filter, pageIndex: pageIndex });
    },
    [filter]
  );
  useEffect(() => {
    fetchAllDocument();
  }, [filter]);

  useEffect(() => {
    fetchAllTypeDoc();
    fetchProgram();
    // fetchAllSubject();
  }, []);
  return (
    <>
      <Head>
        <title> Hệ thống quản lý Học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tài liệu tổng hợp"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Chương trình học',
              href: PATH_DASHBOARD.program.choose,
            },
            {
              name: program.name,
            },
          ]}
        />
        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <TextField
              size="small"
              sx={{ mr: 3 }}
              autohighlight="true"
              onChange={handleSearchChange}
              placeholder="Tìm kiếm..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 180, mr: 2 }} size="small">
              <InputLabel id="demo-simple-select-helper-label">Loại tài liệu</InputLabel>
              <Select id="demo-simple-select-helper" label="TypeDocument" onChange={handleFilterDocType}>
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                {renderMenuItem(typeDocs)}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="demo-simple-select-helper-label">Môn học</InputLabel>
              <Select id="demo-simple-select-helper" label="Subject" onChange={handleFilterSubject}>
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                {user.subjects?.map((obj, index) => (
                  <MenuItem value={obj} key={index}>
                    {obj.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>

        <DocumentPostCard documents={documents} />

        <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center" mt={2}>
          <Pagination
            size="small"
            count={paging?.TotalPages}
            rowsperpage={paging?.PageSize}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </Container>
    </>
  );
}
