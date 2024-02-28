// next
import React, { useEffect, useState } from 'react';
import { useSettingsContext } from '../../../components/settings';
import { Box, Container, Grid, Alert } from '@mui/material';
import DashboardLayout from '../../../layouts/dashboard';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import ProgramSliderCards from '../../../sections/@dashboard/program/ProgramSliderCards';
import { getAllProgram } from '../../../dataProvider/agent';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { BookingIllustration } from '../../../assets/illustrations';
Program.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default function Program() {
    const dispatch = useDispatch();
    const { themeStretch } = useSettingsContext();
    const [listPrograms, setListPrograms] = useState([]);

    useEffect(() => {
        fetchPrograms();
    }, []);

    async function fetchPrograms() {
        const res = await getAllProgram({ pageIndex: 1, pageSize: 100 });
        if (res.status < 400) {
            setListPrograms(res.data.data);
        } else {
            <Alert severity="info" sx={{ mb: 3 }}>
                {res.message}
            </Alert>;
        }
    }

    return (
        <React.Fragment>
            <Head>
                <title> Hệ thống quản lý học liệu</title>
            </Head>
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Chương trình học"
                    links={[
                        {
                            name: 'Trang chủ',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Chương trình học',
                            href: PATH_DASHBOARD.program.choose,
                        },
                    ]}
                />
                <Grid container spacing={2}>
                    {listPrograms.map((item) => (
                        <Grid key={item.id}  item xs={12} md={6} sm={6}>
                            <ProgramSliderCards item={item} icon={<BookingIllustration />} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </React.Fragment>
    );
}
