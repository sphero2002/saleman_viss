import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../../layouts/dashboard';
import { Container, Grid, Stack, Alert, Typography } from '@mui/material';
import { useSettingsContext } from '../../../../../components/settings';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// component subject
import SysllabusSubject from '../../../../../sections/@dashboard/myclass/subject/SysllabusSubject';
import DocumentLocal from '../../../../../sections/@dashboard/myclass/subject/DocumentLocal';
import Head from 'next/head';

// API
import { getSubjectById, getDocInClass } from '../../../../../dataProvider/agent';

index.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default function index() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { myclass_id, mysubject_id },
  } = useRouter();

  const [subject, setSubject] = useState();

  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fethOneSubject();
    fetchDocumentInClass();
  }, [mysubject_id]);

  async function fethOneSubject() {
    const res = await getSubjectById(mysubject_id);
    if (res.status < 400) {
      setSubject(res.data.data);
    } else {
      <Alert severity="info" sx={{ mb: 3 }}>
        {res.message}
      </Alert>;
    }
  }

  async function fetchDocumentInClass() {
    const res = await getDocInClass({
      classId: myclass_id,
      subjectId: mysubject_id,
    });
    if (res.status < 400) {
      setDocs(res.data.data);
    } else {
      <Alert severity="info" sx={{ mb: 3 }}>
        {res.message}
      </Alert>;
    }
  }
  return (
    <>
      <Head>
        <title> Hệ thống quản lý Học liệu</title>
      </Head>

      <Container maxWidth={'xl'}>
        <CustomBreadcrumbs
          heading="Khung chương trình"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Môn học', href: PATH_DASHBOARD.myclass.classdetail(myclass_id) },
            { name: 'Khung chương trình' },
          ]}
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={12}>
            <DocumentLocal docs={docs} />
          </Grid>

          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography variant="h5"> Tài liệu từng slot</Typography>
              {subject?.listSlots?.map((data) => (
                <SysllabusSubject data={data} classId={myclass_id} subjectId={mysubject_id}  key={data.id} docs={docs} />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
