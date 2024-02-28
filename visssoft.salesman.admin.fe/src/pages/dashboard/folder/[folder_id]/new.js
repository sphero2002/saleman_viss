// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import { FolderNewPostForm } from '../../../../sections/@dashboard/folder';
import { useSelector } from 'react-redux';
import { dispatch } from 'src/redux/store';
import { createDocumentInitialRedux } from 'src/redux/slices/folder';
import { useEffect } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

FolderNewDocumentPostPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function FolderNewDocumentPostPage() {
  const { push } = useRouter();
  const { themeStretch } = useSettingsContext();
  const { folder } = useSelector((state) => state.folder);

  useEffect(() => {
    if (!folder.id) {
      push(PATH_DASHBOARD.folder.root);
    }
    dispatch(createDocumentInitialRedux());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title> Thêm tài liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo một tài liệu mới"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Tài Liệu Của Tôi',
              href: PATH_DASHBOARD.folder.root,
            },
            {
              name: `${folder.name}`,
              href: PATH_DASHBOARD.folder.link(folder.id),
            },
            {
              name: 'Tạo tài liệu',
            },
          ]}
        />
        <FolderNewPostForm
          data={{
            ...folder,
            archiveFolderId: folder.id,
            handleBackPage: () => {
              dispatch(getFolderRedux(folder.parentId, 'folder'));
            },
            types: ['folder'],
            menuSubFolder: ['edit', 'delete'],
            menuDocument: ['preview', 'download', 'share', 'delete'],
            panel: ['folder'],
          }}
        />
      </Container>
    </>
  );
}
