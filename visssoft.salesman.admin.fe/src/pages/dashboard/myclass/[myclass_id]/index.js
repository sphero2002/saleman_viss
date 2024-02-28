// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

import { Grid, Container, Tab, Tabs, Card, Divider, Box, Alert, Button } from '@mui/material';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// _mock_
import { _subjects, _subjectNew, _subjectsOverview, _subjectReview } from '../../../../_mock/arrays';
// components
import { useSettingsContext } from '../../../../components/settings';
import Iconify from '../../../../components/iconify';
// sections
import { ClassWidgetSummary } from '../../../../sections/@dashboard/myclass';
// assets
import ManageSubject from '../../../../sections/@dashboard/myclass/manage/ManageSubject';
import ManageUser from '../../../../sections/@dashboard/myclass/manage/ManageUser';

import { BookingIllustration, CheckInIllustration, CheckOutIllustration } from '../../../../assets/illustrations';
import { useRouter } from 'next/router';
// Dash_board
import { PATH_DASHBOARD } from '../../../../routes/paths';
//API
import { getClassById } from '../../../../dataProvider/agent';
import ClassAddSubjectDialog from "../../../../sections/@dashboard/class/form/ClassAddSubjectDialog";

MyClassDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default function MyClassDetail() {
  const router = useRouter();
  const theme = useTheme();
  const {
    query: { myclass_id },
  } = useRouter();
  console.log('class_id: ', myclass_id);
  const [myClass, setmyClass] = useState();
  const [currentTab, setCurrentTab] = useState('description');

  async function fetchMyClass() {
    const res = await getClassById(myclass_id);
    if (res.status < 400) {
      setmyClass(res.data.data);
    } else {
      <Alert severity="info" sx={{ mb: 3 }}>
        {res.message}
      </Alert>;
    }
  }

  useEffect(() => {
    fetchMyClass();
  }, [myclass_id]);
  const TABS = [
    {
      id: 1,
      value: 'description',
      label: 'Quản lý môn học',
      component: <ManageSubject myClass={myClass} />,
    },
    {
      id: 2,
      value: 'reviews',
      label: `Quản lý người dùng`,
      component: <ManageUser myClass={myClass} />,
    },
  ];

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();
  const handleOnClickSubject = () => {
    push(PATH_DASHBOARD.myclass.addMember(myclass_id));
  };

  const [openAddSubject, setOpenAddSubject] = useState(false);

  const handleOpenAddSubject = () => {
    setOpenAddSubject(true);
  };

  const handleCloseAddSubject = () => {
    setOpenAddSubject(false);
  };

  return (
    <>
      <Head>
        <title> Hệ thống quản lý Học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3} mb={2}>
          <Grid item xs={12} md={4}>
            <ClassWidgetSummary title="Giáo viên" total={7} icon={<BookingIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <ClassWidgetSummary title="Học sinh" total={30} icon={<CheckInIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <ClassWidgetSummary title="Tài liệu" total={124000} icon={<CheckOutIllustration />} />
          </Grid>
        </Grid>

        {currentTab === 'reviews' ? (
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleOnClickSubject} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm người dùng
            </Button>
            <div></div>
          </Box>
        ) : (
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleOpenAddSubject} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm môn học
            </Button>
            <div></div>
          </Box>
        )}

        <ClassAddSubjectDialog classID={myclass_id} open={openAddSubject} onClose={handleCloseAddSubject}/>

        <Card>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{ px: 3, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.id} value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          <Divider />

          {TABS.map(
            (tab) =>
              tab.value === currentTab && (
                <Box
                  key={tab.id}
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
