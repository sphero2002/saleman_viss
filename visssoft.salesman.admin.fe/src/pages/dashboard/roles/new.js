// next
import Head from 'next/head';
// @mui
import {Container} from '@mui/material';
// routes
import {PATH_DASHBOARD} from '../../../routes/paths';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import {useSettingsContext} from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import RoleNewEditForm from '../../../sections/@dashboard/roles/RoleNewEditForm';
import {useEffect, useState} from "react";
import {getAllMenu, getAllPermission, getRoleById} from "../../../dataProvider/agent";

// ----------------------------------------------------------------------

RolesCreatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function RolesCreatePage() {
    const {themeStretch} = useSettingsContext();
    const [permissions, setPermissions] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    async function fetchPermission() {
        const res = await getAllPermission({pageIndex: 1, pageSize: 100});
        console.log('getAllPermission', res.data.data)
        if (res.status < 400) {
            setPermissions(res.data.data);
        } else {
            console.log('error');
        }
    }

    async function fetchMenuItems() {
        const res = await getAllMenu({pageIndex: 1, pageSize: 100});
        console.log(res.data.data)
        if (res.status < 400) {
            setMenuItems(res.data.data);
        } else {
            console.log('error');
        }
    }

    useEffect(() => {
        fetchPermission();
        fetchMenuItems();
    }, []);
    return (
        <>
            <Head>
                <title>Hệ thống quản lý học liệu</title>
            </Head>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Tạo vai trò"
                    links={[
                        {
                            name: 'Trang chủ',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Danh sách vai trò',
                            href: PATH_DASHBOARD.role.list,
                        },
                        {name: 'Tạo mới'},
                    ]}
                />
                <RoleNewEditForm permissions={permissions} menu={menuItems} />
            </Container>
        </>
    );
}
