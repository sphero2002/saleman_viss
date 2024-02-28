import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Breadcrumbs, Button, Container, Grid, IconButton, Link, Stack, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD as folderUploadDoc, PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// _mock
import { _folders } from '../../../../_mock/arrays';
// layouts

import { dispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { createFolderRedux, getFolderRedux } from 'src/redux/slices/folder';
import { useSnackbar } from 'notistack';
import LinkItem from '../../../../components/custom-breadcrumbs/LinkItem';
import Iconify from '../../../../components/iconify';
import DataGridBasic from 'src/sections/_examples/mui/data-grid/DataGridBasic';
import { GeneralFilePage } from 'src/sections/@dashboard/folder';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
FolderPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default function FolderPage({ dataGeneralFolder, dataUploadDocsToSlot }) {
  const { enqueueSnackbar } = useSnackbar();
  const { folder } = useSelector((state) => state.folder);

  useEffect(() => {
    dispatch(getFolderRedux(0, 'folder'));
  }, []);

  return (
    <>
      <GeneralFilePage
        data={{
          ...folder,
          handleBackPage: () => {
            dispatch(getFolderRedux(folder.parentId, 'folder'));
          },
          types: ['folder'],
          menuSubFolder: ['edit', 'delete'],
          menuDocument: ['preview', 'download', 'share', 'delete'],
          panel: ['folder'],
        }}
      ></GeneralFilePage>
    </>
  );
}
