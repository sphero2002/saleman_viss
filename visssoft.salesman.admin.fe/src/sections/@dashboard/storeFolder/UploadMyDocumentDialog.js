import PropTypes from 'prop-types';
// @mui
import { LoadingButton } from '@mui/lab';
import {
    Box,
    Button,
    Card,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
// components
import Scrollbar from '../../../components/scrollbar';
import React, { useCallback, useEffect, useState } from 'react';
import { getDocumentById, getGradeById } from '../../../dataProvider/agent';
import ManageSubject from '../class/manage/ManageSubject';
import ManageUser from '../class/manage/ManageUser';
import { useSelector } from 'react-redux';
import { dispatch } from 'src/redux/store';
import { copyDocsToFolderRedux, copyDocsToStoreFolderRedux, getFolderRedux } from 'src/redux/slices/folder';
import { FolderNewPostForm, GeneralFilePage } from '../folder';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

// UploadMyDocumentDialog.propTypes = {
//   open: PropTypes.bool,
//   onClose: PropTypes.func,
// };

export default function UploadMyDocumentDialog({ open, onClose }) {
    const { folderUploadDoc, storeFolder } = useSelector((state) => state.folder);
    const { enqueueSnackbar } = useSnackbar();

    const [currentTab, setCurrentTab] = useState(0);

    const handleUploadDocumentToStoreFolder = async (myDocumentId) => {
        const message = await dispatch(copyDocsToStoreFolderRedux(storeFolder.id, myDocumentId));
        if (message) {
            enqueueSnackbar(message.title, { variant: message.variant });
        }
    };

    const tabs = [
        {
            id: 0,
            value: 'myDocument',
            label: `Tài liệu của tôi`,
            component: (
                <GeneralFilePage
                    data={{
                        handleUploadDocumentToStoreFolder,
                        ...folderUploadDoc,
                        archiveFolderId: storeFolder.id,
                        handleBackPage: () => {
                            dispatch(getFolderRedux(folderUploadDoc.parentId, 'folderUploadDoc'));
                        },
                        types: ['folderUploadDoc'],
                        menuSubFolder: [],
                        menuDocument: [],
                        panel: ['popup'],
                    }}
                />
            ),
        },
        {
            id: 1,
            value: 'uploadDocument',
            label: 'Đăng tải tài liệu',
            component: (
                <FolderNewPostForm
                    data={{
                        handleUploadDocumentToStoreFolder,
                        ...folderUploadDoc,
                        archiveFolderId: storeFolder.id,
                        handleBackPage: () => {
                            dispatch(getFolderRedux(folderUploadDoc.parentId, 'folderUploadDoc'));
                        },
                        types: ['folderUploadDoc'],
                    }}
                />
            ),
        },
    ];

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            open={open}
            onClose={() => {
                onClose();
            }}
        >
            <DialogActions sx={{ py: 2, px: 3 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Đăng tải tài liệu của tôi
                </Typography>

                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                        onClose();
                    }}
                >
                    Quay lại
                </Button>
            </DialogActions>

            <Divider />
            <Container maxWidth={'xl'}>
                <Tabs
                    value={currentTab}
                    onChange={(event, newValue) => {
                        console.log('onChange', newValue);
                        setCurrentTab(newValue);
                        //   setComponentTab(tabs[newValue].component);
                    }}
                    sx={{ px: 3, bgcolor: 'background.neutral' }}
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.id} value={tab.id} label={tab.label} />
                    ))}
                </Tabs>

                <Divider />

                {tabs.map(
                    (tab) =>
                        tab.id === currentTab && (
                            <Box
                                key={tab.id}
                                sx={{
                                    ...(currentTab === 'description' && {
                                        p: 3,
                                    }),
                                    mt: 2,
                                }}
                            >
                                {tab.component}
                            </Box>
                        )
                )}
                <Divider />
            </Container>
        </Dialog>
    );
}
