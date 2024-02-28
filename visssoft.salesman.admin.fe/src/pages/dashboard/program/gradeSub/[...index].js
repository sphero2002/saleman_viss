import { useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Container, Divider, Tab, Tabs, Card } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import DashboardLayout from '../../../../layouts/dashboard';
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
//
import Grade from '../../../../sections/@dashboard/program/grade/Grade';
import Head from "next/head";

// ----------------------------------------------------------------------

GradeSub.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------
export default function GradeSub() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { title, id },
  } = useRouter();
  console.log('check', title, id);

  return (
    <>
        <Head>
            <title> Hệ thống quản lý Học liệu</title>
        </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Khối học"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Chương trình học',
              href: PATH_DASHBOARD.program.choose,
            },
            {
              name: 'Cấp học',
              // href: PATH_DASHBOARD.program.level(title),
            },
            {
              name: 'Lớp',
            },
          ]}
        />
        <Box>
          <Grade />
        </Box>
      </Container>
    </>
  );
}
