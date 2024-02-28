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
import ClassAddStudentForm from '../../../../sections/@dashboard/class/form/ClassAddStudentForm';
import ClassAddStudentXls from '../../../../sections/@dashboard/class/form/ClassAddStudentXls';
import { dispatch } from 'src/redux/store';
import { getAllUsersWithInfoRedux, getUsersRedux } from 'src/redux/slices/user';

// ----------------------------------------------------------------------

addStudent.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function addStudent() {
  const {
    query: { class_id },
  } = useRouter();

  const [currentTab, setCurrentTab] = useState('description');

  const { themeStretch } = useSettingsContext();

  useEffect(() => {
    dispatch(getAllUsersWithInfoRedux({ pageIndex: 1, pageSize: 20 }, 0));
  }, []);

  const TABS = [
    {
      id: 1,
      value: 'description',
      label: 'Thêm thành viên vào lớp học',
      component: <ClassAddStudentForm classID={class_id} />,
    },
    {
      id: 2,
      value: 'reviews',
      label: `Thêm thành viên từ danh sách Excel`,
      component: <ClassAddStudentXls classID={class_id}/>,
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
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Chi tiết lớp học',
              href: PATH_DASHBOARD.class.detail(class_id),
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
            {TABS.map((tab, index) => (
              <Tab key={index} value={tab.value} label={tab.label} />
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
