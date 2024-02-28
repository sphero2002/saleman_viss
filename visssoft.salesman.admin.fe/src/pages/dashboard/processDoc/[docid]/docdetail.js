import PropTypes from 'prop-types';
// @mui
import { Box, Button, Checkbox, Divider, Drawer, IconButton, List, Stack, Typography, Container } from '@mui/material';
import { FileGeneralRecentCard } from '../../../../sections/@dashboard/general/file';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import DashboardLayout from '../../../../layouts/dashboard';
import FileThumbnail, { fileFormat } from '../../../../components/file-thumbnail';
// utils
import { fData } from '../../../../utils/formatNumber';
import { fDateTime } from '../../../../utils/formatTime';
import FileInvitedItem from '../../../../sections/@dashboard/file/FileInvitedItem';
//
import React, { useCallback, useEffect, useContext, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { dispatch } from 'src/redux/store';
import { getOneDocumentRedux } from 'src/redux/slices/document';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { JsonObjectContext } from '../../../../context/JsonObjectContext';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { getALlRoles, getAllUsers, addShareDoc } from '../../../../dataProvider/agent';

// ----------------------------------------------------------------------

docdetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default function docdetail() {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { getOne } = useSelector((state) => state.document);

    const hasShared = getOne && !!getOne.listShare.length;

    //call query
    const {
        query: { docid },
    } = router;
    console.log('docid', docid)

    const [toggleProperties, setToggleProperties] = useState(true);

    const [toggleCategories, setToggleCategories] = useState(true);

    const handleToggleProperties = () => {
        setToggleProperties(!toggleProperties);
    };

    const handleToggleCategories = () => {
        setToggleCategories(!toggleCategories);
    };

    const redirectToOtherPage = useCallback(() => { 
        router.push(PATH_DASHBOARD.processDoc.list);
    }, []);

    useEffect(() => {
        async function fetchData() { 
            const message = await dispatch(getOneDocumentRedux(docid));   
            if (message && message.variant) {
                enqueueSnackbar(message.title, { variant: message.variant });
                return;
            }
            console.log('getOne.id', getOne.id)
        }
        if (getOne.id == 0) {
            fetchData();
        }

    }, [getOne]);

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>
            <Container maxWidth={'xl'}>
                <CustomBreadcrumbs
                    heading="Xử lý Tài liệu học liệu"
                    links={[
                        { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                        { name: 'Xử lý Tài liệu học liệu', href: PATH_DASHBOARD.processDoc.list },
                        { name: 'Chi tiết tài liệu' },
                    ]}
                />
                <Scrollbar sx={{ height: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
                        <Typography variant="h6"> Thông tin chi tiết </Typography>

                    </Stack>

                    <Stack spacing={2.5} justifyContent="center" sx={{ p: 2.5, bgcolor: 'background.neutral' }}>
                        <FileThumbnail file={getOne.urlDocument} sx={{ width: 64, height: 64 }} imgSx={{ borderRadius: 1 }} />

                        <Typography variant="h6" sx={{ wordBreak: 'break-all' }}>
                            {`Tài liệu: ${getOne.name}`}
                        </Typography>

                        <Typography variant="h7" sx={{ wordBreak: 'break-all' }}>
                            {`Tệp đính kèm: ${getOne.urlDocument}`}
                        </Typography>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        <Stack spacing={1.5}>
                            <Panel label="Danh mục" toggle={toggleCategories} onToggle={handleToggleCategories} />

                            {toggleCategories && getOne ? (
                                <>
                                    <Stack spacing={1.5}>
                                        <Row label="Chương trình học" value={getOne.programName} />

                                        <Row label="Môn học" value={getOne.subjectName} />

                                        <Row label="Loại tài liệu" value={getOne.typeDocumentName} />
                                    </Stack>
                                </>
                            ) : (
                                ''
                            )}
                        </Stack>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        <Stack spacing={1.5}>
                            <Panel label="Thuộc tính" toggle={toggleProperties} onToggle={handleToggleProperties} />

                            {toggleProperties && (
                                <>
                                    <Stack spacing={1.5}>
                                        <Row label="Kích thước" value={`${getOne.size} MB`} />

                                        <Row label="Ngày tạo" value={fDateTime(getOne.createDate)} />

                                        <Row label="Loại" value={fileFormat(getOne.typeFile)} />
                                    </Stack>
                                </>
                            )}
                        </Stack>
                    </Stack>

                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
                        <Typography variant="subtitle2"> Được chia sẻ với {getOne.listShare.length} người </Typography>
                    </Stack>

                    {hasShared && (
                        <List disablePadding sx={{ pl: 2.5, pr: 1 }}>
                            {getOne.listShare.map(({ user, permission }, index) => (
                                <FileInvitedItem key={user.id} user={user} permissionDefault={permission} index={index} />
                            ))}
                        </List>
                    )}
                </Scrollbar>

                <Box sx={{ p: 2.5 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Button
                            fullWidth
                            variant="soft"
                            color="error"
                            size="large"
                            startIcon={<Iconify icon="eva:arrow-back-fill" />}
                            onClick={redirectToOtherPage}
                        >
                            Thoát
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </>
    );
}

// ----------------------------------------------------------------------

Panel.propTypes = {
    toggle: PropTypes.bool,
    label: PropTypes.string,
    onToggle: PropTypes.func,
};

function Panel({ label, toggle, onToggle, ...other }) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" {...other}>
            <Typography variant="subtitle2"> {label} </Typography>

            <IconButton size="small" onClick={onToggle}>
                <Iconify icon={toggle ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />
            </IconButton>
        </Stack>
    );
}

// ----------------------------------------------------------------------

Row.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
};

function Row({ label, value = '' }) {
    return (
        <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 120, color: 'text.secondary', mr: 2 }}>
                {label}
            </Box>

            {value}
        </Stack>
    );
}