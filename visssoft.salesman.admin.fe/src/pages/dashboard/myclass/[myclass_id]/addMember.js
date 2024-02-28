// next
import Head from 'next/head';
// @mui
import { Container, Tab, Tabs, Card, Divider, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
// import ClassNewEditForm from '../../../../sections/@dashboard/class/form/ClassNewEditForm';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
// import { getClassRedux } from 'src/redux/slices/class';
import ClassAddStudentForm from '../../../../sections/@dashboard/myclass/form/ClassAddStudentForm';
import ClassAddStudentXls from '../../../../sections/@dashboard/myclass/form/ClassAddStudentXls';

// ----------------------------------------------------------------------

addMember.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default function addMember() {
  const {
    query: { myclass_id },
  } = useRouter();

  const [currentTab, setCurrentTab] = useState('description');

  const { themeStretch } = useSettingsContext();

  console.log('class ID: ', myclass_id);

  const TABS = [
    {
      value: 'description',
      label: 'Thêm thành viên vào class',
      component: <ClassAddStudentForm isEdit />,
    },
    {
      value: 'reviews',
      label: `Thêm thành viên từ danh sách Excel`,
      component: <ClassAddStudentXls />,
    },
  ];

  return (
    <>
      <Head>
        <title> Hệ thống quản lý Học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Thêm người dùng vào lớp"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Class',
              href: PATH_DASHBOARD.myclass.classdetail(myclass_id),
            },
            {
              name: 'Thêm người dùng',
            },
          ]}
        />
        <Card>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{ px: 3, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          <Divider />

          {TABS.map(
            (tab) =>
              tab.value === currentTab && (
                <Box
                  key={tab.value}
                  sx={{
                    ...(currentTab === 'description' && {
                      p: 3,
                    }),
                  }}
                >
                  {tab.component}
                </Box>
              )
          )}
        </Card>
      </Container>
    </>
  );
}
