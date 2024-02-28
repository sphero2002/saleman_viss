import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock_
import { _subjects } from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import SubjectNewEditForm from '../../../../sections/@dashboard/subject/SubjectNewEditForm';
import { useEffect, useState } from 'react';
import { getAllSlot, getGradeById, getSubjectById } from '../../../../dataProvider/agent';

// ----------------------------------------------------------------------

SubjectEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function SubjectEditPage() {
    const { themeStretch } = useSettingsContext();

    const {
        query: { name },
    } = useRouter();

    const [subjectData, setSubjectData] = useState([]);
    const [slots, setSlots] = useState([]);

    async function fetchSubject() {
        const res = await getSubjectById(name);
        if (res.status < 400) {
            setSubjectData(res.data.data);
        } else {
            console.log(res.message);
        }
    }

    async function fetchSlots() {
        const res = await getAllSlot({ pageIndex: 1, pageSize: 100 });
        if (res.status < 400) {
            setSlots(res.data.data);
        } else {
            console.log('error');
        }
    }

    useEffect(() => {
        fetchSubject();
        fetchSlots();
    }, []);

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Cập nhật môn học"
                    links={[
                        {
                            name: 'Trang chủ',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Danh sách môn học',
                            href: PATH_DASHBOARD.subject.list,
                        },
                        { name: 'Cập nhật môn học' },
                    ]}
                />
                <SubjectNewEditForm isEdit currentSubject={subjectData} slots={slots} />
            </Container>
        </>
    );
}
