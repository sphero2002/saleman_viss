import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock_
import { _programList } from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import ProgramNewEditForm from '../../../../sections/@dashboard/program/ProgramNewEditForm';
import {useEffect, useState} from "react";
import {getProgramById, getUserById} from "../../../../dataProvider/agent";

// ----------------------------------------------------------------------

ProgramEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ProgramEditPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { name },
  } = useRouter();

    const [programData, setProgramData] = useState([]);

    useEffect(() => {
        fetchProgram();
    }, []);

    async function fetchProgram() {
        const res = await getProgramById(name);
        if (res.status < 400) {
            setProgramData(res.data.data);
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
          heading="Cập nhật chương trình học"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách chương trình học',
              href: PATH_DASHBOARD.program.list,
            },
            { name: `Cập nhật chương trình học`},
          ]}
        />

        <ProgramNewEditForm isEdit currentProgram={programData} />
      </Container>
    </>
  );
}
