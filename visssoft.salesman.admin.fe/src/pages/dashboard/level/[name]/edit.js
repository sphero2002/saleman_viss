import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock_
import { _levelList } from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import LevelNewEditForm from '../../../../sections/@dashboard/level/LevelNewEditForm';
import {useEffect, useState} from "react";
import {getLevelById, getProgramById} from "../../../../dataProvider/agent";

// ----------------------------------------------------------------------

LevelEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function LevelEditPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { name },
  } = useRouter();


    const [levelData, setLevelData] = useState([]);

    useEffect(() => {
        fetchLevel();
    }, []);

    async function fetchLevel() {
        const res = await getLevelById(name);
        if (res.status < 400) {
            setLevelData(res.data.data);
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
          heading="Cập nhật cấp học"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách cấp học',
              href: PATH_DASHBOARD.level.list,
            },
            { name: 'Cập nhật cấp học'},
          ]}
        />

        <LevelNewEditForm isEdit currentLevel={levelData} />
      </Container>
    </>
  );
}
