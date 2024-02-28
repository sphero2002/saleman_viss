import { useCallback, useEffect, useState } from 'react';
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// _mock
import { _storeFolders } from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import Scrollbar from '../../../../components/scrollbar';
import { useSettingsContext } from '../../../../components/settings';
// sections
import { FileFolderCard, FileNewFolderDialog, FilePanel } from '../../../../sections/@dashboard/file';
import { useRouter } from 'next/router';
import { dispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { getFolderRedux, getStoreFolderRedux } from '../../../../redux/slices/folder';
import Iconify from '../../../../components/iconify';
import UploadMyDocumentDialog from '../../../../sections/@dashboard/storeFolder/UploadMyDocumentDialog';
import PopupGetFolder from 'src/sections/@dashboard/general/getFiletoDocPrivate/PopupGetFolder';
import { useSnackbar } from 'notistack';
import { GeneralFilePage } from 'src/sections/@dashboard/folder';
// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

// ----------------------------------------------------------------------

StoreFilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function StoreFilePage() {
    const {
        query: { uploadfile_id: uploadfileID },
        push,
    } = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    const { uploadfile } = useSelector((state) => state.folder);

    useEffect(() => {
        if (uploadfileID) {
            dispatch(getFolderRedux(uploadfileID, 'uploadfile'));
        }
    }, [uploadfileID]);

    return (
        <>
            <GeneralFilePage
                data={{
                    ...uploadfile,
                    handleBackPage: () => {
                        dispatch(getFolderRedux(uploadfiles.parentId, 'uploadfiles'));
                    },
                    types: ['uploadfiles'],
                    menuSubFolder: ['edit', 'delete'],
                    menuDocument: ['preview', 'download', 'saveInMyFolder', 'delete'],
                    panel: ['uploadfiles'],
                }}
            ></GeneralFilePage>
        </>
    );
}
