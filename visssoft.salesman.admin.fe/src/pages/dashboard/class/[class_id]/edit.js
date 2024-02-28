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
import ClassNewEditForm from '../../../../sections/@dashboard/class/form/ClassNewEditForm';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {useEffect, useState} from 'react';
import { getClassRedux } from 'src/redux/slices/class';
import {getClassById, getGradeById} from "../../../../dataProvider/agent";

// ----------------------------------------------------------------------

ClassCreatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ClassCreatePage() {
    const { themeStretch } = useSettingsContext();

    const {
        query: { class_id },
    } = useRouter();

    const [classData, setClassData] = useState([]);

    useEffect(() => {
        fetchClass();
    }, []);

    async function fetchClass() {
        const res = await getClassById(class_id);
        if (res.status < 400) {
            setClassData(res.data.data);
        } else {
            console.log(res.respon.data.title);
        }
    }

  return (
    <>
      <Head>
        <title> Hệ thống quản lý Học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Cập nhật lớp học"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách lớp học',
              href: PATH_DASHBOARD.class.root,
            },
            {
              name: 'Cập nhật',
            },
          ]}
        />
        <ClassNewEditForm isEdit currentClass={classData} />
      </Container>
    </>
  );
}
