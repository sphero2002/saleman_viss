import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock_
import { _typeDocumentList } from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import PermissionNewEditForm from '../../../../sections/@dashboard/permission/PermissionNewEditForm';
import {useEffect, useState} from "react";
import {getPermissionById, getTypeDocumentById} from "../../../../dataProvider/agent";

// ----------------------------------------------------------------------

PermissionEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PermissionEditPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { name },
  } = useRouter();


    const [permissionData, setPermissionData] = useState([]);

    useEffect(() => {
        fetchPermission();
    }, []);

    async function fetchPermission() {
        const res = await getPermissionById(name);
        if (res.status < 400) {
            setPermissionData(res.data.data);
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
          heading="Cập nhật quyền"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách quyền',
              href: PATH_DASHBOARD.permission.list,
            },
            { name: 'Cập nhật quyền'},
          ]}
        />

        <PermissionNewEditForm isEdit currentPermission={permissionData} />
      </Container>
    </>
  );
}
