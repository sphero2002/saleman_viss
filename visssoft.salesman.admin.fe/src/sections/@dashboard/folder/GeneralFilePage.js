import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Grid, IconButton, Link, Pagination, Stack, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';

// hooks
// _mock
import { _folders } from 'src/_mock/arrays';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
// sections
import { FileGeneralRecentCard } from 'src/sections/@dashboard/general/file';
import { FileFolderCard, FileNewFolderDialog, FilePanel } from 'src/sections/@dashboard/file';
import { useRouter } from 'next/router';
import { dispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import {
    createDocumentInitialRedux,
    createFolderRedux,
    createStoreFolderRedux,
    getFolderRedux,
    getFolderSavetoDocToMyFolderRedux,
} from 'src/redux/slices/folder';
import { useSnackbar } from 'notistack';
import LinkItem from 'src/components/custom-breadcrumbs/LinkItem';
import Iconify from 'src/components/iconify';
import DataGridBasic from 'src/sections/_examples/mui/data-grid/DataGridBasic';
import UploadMyDocumentDialog from '../storeFolder/UploadMyDocumentDialog';
import PopupGetFolder from '../general/getFiletoDocPrivate/PopupGetFolder';
import UploadNewDocToSlotDialog from '../myclass/popupdiaglog/UploadNewDocToSlot';
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

// ----------------------------------------------------------------------

GeneralFilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralFilePage({ data }) {
    const { user } = useAuthContext();
    const { newDocument } = useSelector((state) => state.folder);
    const theme = useTheme();
    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { id, name, parentId, listFolders, listDocuments } = data;
    console.log('GeneralFilePagelistDocuments', listDocuments);

    const { themeStretch } = useSettingsContext();

    const [folderName, setFolderName] = useState('');

    const [documentHandle, setDocumentHandle] = useState({});

    const [openNewFolder, setOpenNewFolder] = useState(false);

    const [openFormUploadDocument, setOpenFormUploadDocument] = useState(false);

    const [openPopupSaveInMyFolder, setOpenPopupSaveInMyFolder] = useState(false);

    const [openPopupUploadNewDocToSlot, setOpenPopupUploadNewDocToSlot] = useState(false);

    const handlePopupUploadNewDocToSlot = () => {
        setOpenPopupUploadNewDocToSlot(false);
    };

    const handleClosePopupSaveInMyFolder = () => {
        setOpenPopupSaveInMyFolder(false);
    };

    const handleOpenPopupSaveInMyFolder = async (data) => {
        const { document } = data;
        await dispatch(getFolderRedux(0, 'folderSaveDocToMyFolder'));
        setDocumentHandle(document);
        setOpenPopupSaveInMyFolder(true);
    };

    const handleOpenFormUploadDocument = async () => {
        await dispatch(getFolderRedux(0, 'folderUploadDoc'));
        await dispatch(createDocumentInitialRedux());
        setOpenFormUploadDocument(true);
    };

    const handleOpenNewFolder = () => {
        setOpenNewFolder(true);
    };

    const handleCloseNewFolder = () => {
        setOpenNewFolder(false);
    };

    const handleOpenUploadFile = () => {
        push(PATH_DASHBOARD.folder.newDocument(Number.parseInt(id)));
        // setOpenUploadFile(true);
    };

    const handleChangeFolderName = useCallback((event) => {
        setFolderName(event.target.value);
    }, []);

    const handleCreateNewFolder = async () => {
        if (data.types.find((type) => type === 'storeFolder')) {
            const message = await dispatch(
                createStoreFolderRedux({
                    name: folderName,
                    parentId: Number.parseInt(id),
                })
            );
            if (message) {
                enqueueSnackbar(message.title, { variant: message.variant });
            }
            setFolderName('');
            handleCloseNewFolder();
        } else if (data.types.find((type) => type === 'folder')) {
            const message = await dispatch(
                createFolderRedux({
                    name: folderName,
                    parentId: Number.parseInt(id),
                })
            );
            if (message) {
                enqueueSnackbar(message.title, { variant: message.variant });
            }
            setFolderName('');
            handleCloseNewFolder();
        } else {
            enqueueSnackbar(`Chỉ được tạo tài liệu ở thư mục của tôi và thư mục chung`, { variant: `error` });
        }
    };

    const handlePageChange = async (event, pageIndex) => {
        await dispatch(
            getFolderRedux(data.id, data.types[0], {
                ...data.pagination,
                CurrentPage: pageIndex,
            })
        );
    };

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Box>
                    <Stack flexGrow={1}>
                        <Stack direction="row" alignItems="center" spacing={1} flexGrow={1}>
                            <IconButton
                                size="small"
                                color="success"
                                disabled={parentId === 0}
                                onClick={data.handleBackPage}
                                sx={{
                                    p: 0,
                                    width: 24,
                                    height: 24,
                                    color: 'common.white',
                                    bgcolor: 'success.main',
                                    '&:hover': {
                                        bgcolor: 'success.main',
                                    },
                                }}
                            >
                                <Iconify icon="eva:arrow-back-outline" />
                            </IconButton>
                            <Typography variant="h4"> {data.name} </Typography>
                        </Stack>
                    </Stack>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <div>
                            <FilePanel
                                title="Thư mục"
                                link={PATH_DASHBOARD.fileManager}
                                onOpen={
                                    // bật lên với folder bình thường
                                    data.panel.find((menu) => menu === 'folder' || menu === 'storeFolder') && handleOpenNewFolder
                                }
                                sx={{ mt: 5 }}
                            />
                            <Scrollbar>
                                <Stack direction="row" spacing={3} sx={{ pb: 3 }}> 
                                    {listFolders?.map((folder, index) => (
                                        <FileFolderCard
                                            data={data}
                                            key={folder.id}
                                            folder={folder}
                                            sx={{
                                                ...(_folders.length > 3 && {
                                                    minWidth: 222,
                                                }),
                                            }}
                                            onDelete={() => { }}
                                        />
                                    ))}
                                </Stack>
                            </Scrollbar>

                            <FilePanel
                                title="Tài liệu gần đây"
                                link={PATH_DASHBOARD.fileManager}
                                onOpen={
                                    (data.panel.find((panel) => panel === 'folder') && handleOpenUploadFile) ||
                                    (data.panel.find((panel) => panel === 'storeFolder') && handleOpenFormUploadDocument) ||
                                    (data.panel.find((panel) => panel === 'popupUploadDocToSlot') &&
                                        (async () => {
                                            await dispatch(createDocumentInitialRedux());
                                            setOpenPopupUploadNewDocToSlot(true);
                                        }))
                                }
                                sx={{ mt: 2 }}
                            />

                            <Stack spacing={2}>
                                {listDocuments?.map((file) => (
                                    <FileGeneralRecentCard
                                        data={data}
                                        key={file.id}
                                        file={file}
                                        handleOpenPopupSaveInMyFolder={handleOpenPopupSaveInMyFolder}
                                    />
                                ))}
                            </Stack>
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={12} justifyContent="flex-end">
                    <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center" mt={2}>
                        <Pagination
                            size="small"
                            count={data.pagination?.TotalPages}
                            rowsperpage={data.pagination?.PageSize}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Stack>
                </Grid>
            </Container>
            {openNewFolder && (
                <FileNewFolderDialog
                    open={openNewFolder}
                    onClose={handleCloseNewFolder}
                    title="New Folder"
                    folderName={folderName}
                    onChangeFolderName={handleChangeFolderName}
                    onCreate={handleCreateNewFolder}
                />
            )}

            {openFormUploadDocument && (
                <UploadMyDocumentDialog open={openFormUploadDocument} onClose={() => setOpenFormUploadDocument(false)} />
            )}

            {openPopupSaveInMyFolder && (
                <PopupGetFolder open={openPopupSaveInMyFolder} onClose={handleClosePopupSaveInMyFolder} data={documentHandle} />
            )}
            {openPopupUploadNewDocToSlot && (
                <UploadNewDocToSlotDialog
                    open={openPopupUploadNewDocToSlot}
                    onClose={handlePopupUploadNewDocToSlot}
                    data={data}
                />
            )}
        </>
    );
}
