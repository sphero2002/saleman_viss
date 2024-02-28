import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock_
import { _gradeList } from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import GradeNewEditForm from '../../../../sections/@dashboard/grade/GradeNewEditForm';
import {useEffect, useState} from "react";
import {getGradeById, getLevelById} from "../../../../dataProvider/agent";

// ----------------------------------------------------------------------

GradeEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GradeEditPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { name },
  } = useRouter();

    const [gradeData, setGradeData] = useState([]);

    useEffect(() => {
        fetchGrade();
    }, []);

    async function fetchGrade() {
        const res = await getGradeById(name);
        if (res.status < 400) {
            setGradeData(res.data.data);
        } else {
            console.log(res.message);
        }
    }

  return (
    <>
      <Head>
        <title> Hệ thống quản lý Học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Cập nhật khối học"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách khối học',
              href: PATH_DASHBOARD.grade.list,
            },
            { name: 'Cập nhật khối học' },
          ]}
        />

        <GradeNewEditForm isEdit currentGrade={gradeData} />
      </Container>
    </>
  );
}
