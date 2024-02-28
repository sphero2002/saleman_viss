// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import TypeDocsNewEditForm from '../../../sections/@dashboard/typeDocs/TypeDocsNewEditForm';

// ----------------------------------------------------------------------

TypeDocsCreatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function TypeDocsCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title>Hệ thống quản lý học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo loại tài liệu"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách loại tài liệu',
              href: PATH_DASHBOARD.type_documents.list,
            },
            { name: 'Tạo mới' },
          ]}
        />
        <TypeDocsNewEditForm />
      </Container>
    </>
  );
}
