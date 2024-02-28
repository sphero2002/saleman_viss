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
import LevelNewEditForm from '../../../sections/@dashboard/level/LevelNewEditForm';

// ----------------------------------------------------------------------

LevelCreatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function LevelCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title>Hệ thống quản lý học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo cấp học"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách cấp học',
              href: PATH_DASHBOARD.level.list,
            },
            { name: 'Tạo mới' },
          ]}
        />
        <LevelNewEditForm />
      </Container>
    </>
  );
}
