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
import SubjectNewEditForm from '../../../sections/@dashboard/subject/SubjectNewEditForm';
import {useEffect, useState} from "react";
import {getAllSlot} from "../../../dataProvider/agent";

// ----------------------------------------------------------------------

SubjectCreatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function SubjectCreatePage() {
  const { themeStretch } = useSettingsContext();

  const [slots, setSlots] = useState([]);

    async function fetchSlots() {
        const res = await getAllSlot({ pageIndex: 1, pageSize: 100 });
        if (res.status < 400) {
            setSlots(res.data.data);
        } else {
            console.log('error');
        }
    }

    useEffect(() => {
        fetchSlots();
    }, []);

  return (
    <>
      <Head>
        <title>Hệ thống quản lý học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo môn học mới"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách môn học',
              href: PATH_DASHBOARD.subject.list,
            },
            { name: 'Tạo mới' },
          ]}
        />
        <SubjectNewEditForm slots={slots}/>
      </Container>
    </>
  );
}
