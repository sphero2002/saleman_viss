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
import TypeDocsNewEditForm from '../../../../sections/@dashboard/typeDocs/TypeDocsNewEditForm';
import { useEffect, useState } from "react";
import { getTypeDocumentById } from "../../../../dataProvider/agent";

// ----------------------------------------------------------------------

TypeDocsEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function TypeDocsEditPage() {
    const { themeStretch } = useSettingsContext();

    const {
        query: { name },
    } = useRouter();


    const [typeDocsData, setTypeDocsData] = useState([]);

    useEffect(() => {
        fetchTypeDocs();
    }, []);

    async function fetchTypeDocs() {
        const res = await getTypeDocumentById(name);
        if (res.status < 400) {
            setTypeDocsData(res.data.data);
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
                    heading="Cập nhật Menu Hệ thống"
                    links={[
                        {
                            name: 'Trang chủ',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Danh sách Menu Hệ thống',
                            href: PATH_DASHBOARD.menu.list,
                        },
                        { name: 'Cập nhật Menu Hệ thống' },
                    ]}
                />

                <TypeDocsNewEditForm isEdit currentTypeDocs={typeDocsData} />
            </Container>
        </>
    );
}
