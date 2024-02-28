import React from 'react';
import { useCallback, useEffect, useState } from 'react';
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// import { PATH_DASHBOARD } from 'src/routes/paths';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// _mock
import { _folders } from 'src/_mock/arrays';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
// sections
import { FileFolderCard, FileNewFolderDialog, FilePanel, FolderGeneralData } from 'src/sections/@dashboard/file';
import { useRouter } from 'next/router';
import { dispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { createFolderRedux, getFolderRedux } from 'src/redux/slices/folder';
import { useSnackbar } from 'notistack';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import {LoadingButton} from "@mui/lab";

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

// ----------------------------------------------------------------------

GeneralFolderPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default function GeneralFolderPage({ data }) {
  const { enqueueSnackbar } = useSnackbar();

  const { id, name, parentId, listFolders, listDocuments } = data;

  const { themeStretch } = useSettingsContext();

    const isDesktop = useResponsive('up', 'sm');
  return (
    <>
      <Head>
        <title> Hệ thống quản lý Học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box sx={{ mt: 1 }}>
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
        <Grid container spacing={3} sx={{mb:2}}>
          <Grid item xs={12} md={12} lg={12}>
            <div>
              <FilePanel
                title="Thư mục"
                link={PATH_DASHBOARD.fileManager}
                // onder ? handleOpenNewFolder : ''}
                sx={{ mt: 5 }}
              />
              <Scrollbar>
                <Stack direction="column" spacing={3} sx={{ pb: 3 }}>
                  {listFolders && listFolders.length
                    ? listFolders.map((folder, index) => (
                        <FolderGeneralData
                          data={data}
                          key={index}
                          folder={folder}
                          sx={{
                              p: 2.5,
                              borderRadius: 2,
                              position: 'relative',
                              border: (theme) => `solid 1px ${theme.palette.divider}`,
                              '&:hover': {
                                  bgcolor: 'background.paper',
                                  boxShadow: (theme) => theme.customShadows.z20,
                                  cursor: 'pointer',
                              },
                              ...(isDesktop && {
                                  p: 1.5,
                                  borderRadius: 1.5,
                              }),

                          }}
                        />
                      ))
                    : ''}
                </Stack>
              </Scrollbar>
            </div>
          </Grid>

        </Grid>
          <Stack
              spacing={2}
              direction={{ xs: 'column-reverse', md: 'row' }}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              sx={{ mt: -2, mb: 1 }}
          >
              <Stack spacing={2} justifyContent="flex-end" direction={{ xs: 'column', md: 'row' }} sx={{ width: 1 }}>
                  <LoadingButton
                      type="submit"
                      variant="contained"
                      size="large"
                      onClick={() => {
                          if (data) {
                              data.handleUploadDocumentToMyFolder(data);
                          }
                      }}
                  >
                      Lưu tài liệu
                  </LoadingButton>
              </Stack>
          </Stack>
      </Container>
    </>
  );
}
