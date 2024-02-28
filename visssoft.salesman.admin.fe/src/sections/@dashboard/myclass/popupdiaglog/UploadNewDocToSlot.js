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
import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { dispatch } from 'src/redux/store';
import { copyDocsToFolderRedux } from 'src/redux/slices/folder';
import { useSnackbar } from 'notistack';
import { FolderNewPostForm } from '../../folder';

// ----------------------------------------------------------------------

// UploadMyDocumentDialog.propTypes = {
//   open: PropTypes.bool,
//   onClose: PropTypes.func,
// };

export default function UploadNewDocToSlotDialog({ open, onClose, data }) {
    const { folderUploadDocToSlot } = useSelector((state) => state.folder);
    const { enqueueSnackbar } = useSnackbar();

    const [currentTab, setCurrentTab] = useState(0);

    const tabs = [
        {
            id: 0,
            value: 'uploadDocument',
            label: 'Đăng tải tài liệu',
            component: <FolderNewPostForm data={data} />,
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
