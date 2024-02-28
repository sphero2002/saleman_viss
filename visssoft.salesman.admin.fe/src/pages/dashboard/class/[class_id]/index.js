// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

import { Grid, Container, Tab, Tabs, Card, Divider, Box, Alert, Button } from '@mui/material';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// _mock_
import { _subjects, _subjectNew, _subjectsOverview, _subjectReview } from '../../../../_mock/arrays';
// components
import { useSettingsContext } from '../../../../components/settings';
import { useSnackbar } from '../../../../components/snackbar';

import Iconify from '../../../../components/iconify';
// sections
import { ClassWidgetSummary } from '../../../../sections/@dashboard/class';
// assets
import ManageSubject from '../../../../sections/@dashboard/class/manage/ManageSubject';
import ManageUser from '../../../../sections/@dashboard/class/manage/ManageUser';

import { BookingIllustration, CheckInIllustration, CheckOutIllustration } from '../../../../assets/illustrations';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';
//API
import { getClassById, deleteSubjectInClass } from '../../../../dataProvider/agent';
import ClassAddSubjectDialog from '../../../../sections/@dashboard/class/form/ClassAddSubjectDialog';
import { useAuthContext } from 'src/auth/useAuthContext';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import LoadingScreen from '../../../../components/loading-screen';
// ----------------------------------------------------------------------

ClassDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------
export default function ClassDetail() {
    const router = useRouter();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthContext();

    const [loading, setLoading] = useState(false);
    const {
        query: { class_id },
    } = useRouter();
    const [myClass, setmyClass] = useState();
    const [currentTab, setCurrentTab] = useState('description');

    async function fetchMyClass() {
        const res = await getClassById(class_id);
        if (res.status < 400) {
            setmyClass(res.data.data);
        } else {
            <Alert severity="info" sx={{ mb: 3 }}>
                {res.message}
            </Alert>;
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchMyClass();
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [class_id]);
    const TABS = [
        {
            id: 1,
            value: 'description',
            label: 'Quản lý môn học',
            component: <ManageSubject fetchMyClass={() => fetchMyClass()} classID={class_id} user={user} myClass={myClass} />,
        },
        {
            id: 2,
            value: 'reviews',
            label: `Quản lý người dùng`,
            component: <ManageUser fetchMyClass={() => fetchMyClass()} classID={class_id} user={user} myClass={myClass} />,
        },
    ];

    const { themeStretch } = useSettingsContext();

    const { push } = useRouter();
    const handleOnClickAddMember = () => {
        push(PATH_DASHBOARD.class.addmembers(class_id));
    };

    const [openAddSubject, setOpenAddSubject] = useState(false);

    const handleOpenAddSubject = () => {
        setOpenAddSubject(true);
    };

    const handleCloseAddSubject = () => {
        setOpenAddSubject(false);
    };

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>

            {loading ? (
                <LoadingScreen />
            ) : (
                <Container maxWidth={themeStretch ? false : 'xl'}>
                    <CustomBreadcrumbs heading={`Lớp ${myClass?.name}`} links={[{ name: 'Thông tin lớp học' }]} />

                    {user?.roles.find((role) => role.name === 'ADMIN' || role.name === 'TRUONGBOMON') ? (
                        <>
                            {currentTab === 'reviews' ? (
                                <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        onClick={handleOnClickAddMember}
                                        variant="contained"
                                        startIcon={<Iconify icon="eva:plus-fill" />}
                                    >
                                        Thêm thành viên
                                    </Button>
                                    <div></div>
                                </Box>
                            ) : (
                                <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        onClick={handleOpenAddSubject}
                                        variant="contained"
                                        startIcon={<Iconify icon="eva:plus-fill" />}
                                    >
                                        Thêm môn học
                                    </Button>
                                    <div></div>
                                </Box>
                            )}
                        </>
                    ) : (
                        ''
                    )}

                    <ClassAddSubjectDialog
                        fetchMyClass={() => fetchMyClass()}
                        classID={class_id}
                        open={openAddSubject}
                        onClose={handleCloseAddSubject}
                    />

                    <Card>
                        <Tabs
                            value={currentTab}
                            onChange={(event, newValue) => setCurrentTab(newValue)}
                            sx={{ px: 3, bgcolor: 'background.neutral' }}
                        >
                            {TABS.map((tab) => (
                                <Tab key={tab.id} value={tab.value} label={tab.label} />
                            ))}
                        </Tabs>

                        <Divider />

                        {TABS.map(
                            (tab) =>
                                tab.value === currentTab && (
                                    <Box
                                        key={tab.id}
                                        sx={{
                                            ...(currentTab === 'description' && {
                                                p: 3,
                                            }),
                                        }}
                                    >
                                        {tab.component}
                                    </Box>
                                )
                        )}
                    </Card>
                </Container>
            )}
        </>
    );
}
