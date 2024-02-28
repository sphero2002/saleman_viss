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
import GradeNewEditForm from '../../../../sections/@dashboard/grade/GradeNewEditForm';
import ProgramNewEditForm from "../../../../sections/@dashboard/program/ProgramNewEditForm";

// ----------------------------------------------------------------------

ProgramCreatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ProgramCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title>Hệ thống quản lý học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo chương trình học"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách chương trình học',
              href: PATH_DASHBOARD.program.list,
            },
            { name: 'Tạo mới' },
          ]}
        />
        <ProgramNewEditForm />
      </Container>
    </>
  );
}
