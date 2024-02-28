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
import PermissionNewEditForm from '../../../sections/@dashboard/permission/PermissionNewEditForm';

// ----------------------------------------------------------------------

PermissionCreatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PermissionCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title>Hệ thống quản lý học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo quyền"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách quyền',
              href: PATH_DASHBOARD.permission.list,
            },
            { name: 'Tạo mới' },
          ]}
        />
        <PermissionNewEditForm />
      </Container>
    </>
  );
}
