// next
import Head from 'next/head';
import {useRouter} from 'next/router';
// @mui
import {Container} from '@mui/material';
// routes
import {PATH_DASHBOARD} from '../../../../routes/paths';
// _mock_
import {_subjects, _userList} from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import {useSettingsContext} from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import UserEditForm from "../../../../sections/@dashboard/user/UserEditForm";
import {useEffect, useState} from "react";
import {getAllUsers, getUserById} from "../../../../dataProvider/agent";

// ----------------------------------------------------------------------

UserEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function UserEditPage() {
    const {themeStretch} = useSettingsContext();
    const {
        query: {name},
    } = useRouter();


    const [userData, setUserData] = useState([]);

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        const res = await getUserById(name);
        if (res.status < 400) {
            setUserData(res.data.data);
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
                    heading="Cập nhật người dùng"
                    links={[
                        {
                            name: 'Trang chủ',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Danh sách người dùng',
                            href: PATH_DASHBOARD.user.list,
                        },

                        {name: `Cập nhật người dùng`},

                    ]}
                />

                <UserEditForm isEdit currentUser={userData}/>
            </Container>
        </>
    );
}
