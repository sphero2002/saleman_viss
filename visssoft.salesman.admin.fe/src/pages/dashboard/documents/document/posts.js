import React, { useEffect, useCallback, useState } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
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
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import Iconify from '../../../../components/iconify';
import { SkeletonPostItem } from '../../../../components/skeleton';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
// sections
// api
import { getDocumentShareWithMe, getAllTypeDocument, getAllSubject } from '../../../../dataProvider/agent';
import { DocumentPostCard } from '../../../../sections/@dashboard/documents';
import { FileGeneralRecentCard } from '../../../../sections/@dashboard/general/file';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

DocumentPostsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function DocumentPostsPage() {
    const { themeStretch } = useSettingsContext();

    const [filter, setFilter] = useState({
        pageIndex: 1,
        pageSize: 8,
        searchByName: '',
        typeDocumentId: '',
        subjectId: '',
    });

    const [paging, setPaging] = useState();
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

    console.log('paging: ', paging);
    const [documents, setDocuments] = useState([]);
    const [typeDocs, setTypeDoc] = useState([]);
    const [subjects, setSubject] = useState([]);

    async function fetchAllDocument() {
        const res = await getDocumentShareWithMe(filter);
        if (res.status < 400) {
            setPaging(JSON.parse(res.headers['x-pagination']));
            setDocuments(res.data.data);
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
            setTypeDoc(res.data);
        } else {
            console.log(res.message);
        }
    }

    async function fetchAllSubject() {
        const res = await getAllSubject({
            pageIndex: 1,
            pageSize: 100,
        });
        if (res.status < 400) {
            setSubject(res.data.data);
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
        fetchAllSubject();
    }, []);

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Danh sách tài liệu"
                    links={[
                        {
                            name: 'Trang chủ',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Danh sách tài liệu',
                        },
                    ]}
                />

                <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row">
                        <TextField
                            size="small"
                            sx={{ mr: 3 }}
                            autohighlight="true"
                            onChange={handleSearchChange}
                            placeholder="Tìm kiếm tài liệu..."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControl sx={{ minWidth: 170 }} size="small">
                            <InputLabel id="demo-simple-select-helper-label">Môn học</InputLabel>
                            <Select id="demo-simple-select-helper" label="Subject" onChange={handleFilterSubject}>
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {renderMenuItem(subjects)}
                            </Select>
                        </FormControl>
                    </Stack>
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
