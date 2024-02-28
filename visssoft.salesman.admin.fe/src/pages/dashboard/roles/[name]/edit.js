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
import RoleNewEditForm from '../../../../sections/@dashboard/roles/RoleNewEditForm';
import {useEffect, useState} from "react";
import {
    getAllMenu,
    getAllPermission,
    getAllSlot,
    getRoleById,
    getTypeDocumentById
} from "../../../../dataProvider/agent";

// ----------------------------------------------------------------------

RolesEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function RolesEditPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { name },
  } = useRouter();


    const [rolesData, setRolesData] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [menu, setMenu] = useState([]);

    async function fetchRoles() {
        const res = await getRoleById(name);
        if (res.status < 400) {
            setRolesData(res.data.data);
        } else {
            console.log(res.message);
        }
    }

    async function fetchPermission() {
        const res = await getAllPermission({ pageIndex: 1, pageSize: 100 });
        console.log('getAllPermission',res.data.data)
        if (res.status < 400) {
            setPermissions(res.data.data);
        } else {
            console.log('error');
        }
    }

    async function fetchMenu() {
        const res = await getAllMenu({ pageIndex: 1, pageSize: 100 });
        if (res.status < 400) {
            setMenu(res.data.data);
        } else {
            console.log('error');
        }
    }

    useEffect(() => {
        fetchRoles();
        fetchPermission();
        fetchMenu();
    }, []);

  return (
    <>
      <Head>
        <title> Hệ thống quản lý Học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Cập nhật vai trò"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách vai trò',
              href: PATH_DASHBOARD.role.list,
            },
            { name: 'Cập nhật vai trò'},
          ]}
        />

        <RoleNewEditForm isEdit currentRoles={rolesData} permissions={permissions} menu={menu} />
      </Container>
    </>
  );
}
