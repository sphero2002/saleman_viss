// next
import Head from 'next/head';
// @mui
import {alpha, styled, useTheme} from '@mui/material/styles';
import {Container, Grid, Stack, Button, Typography} from '@mui/material';
import DashboardLayout from "../../../layouts/dashboard";
import {bgGradient} from "../../../utils/cssStyles";
import {useAuthContext} from "../../../auth/useAuthContext";
import {useSettingsContext} from "../../../components/settings";
import useResponsive from "../../../hooks/useResponsive";
import {AppFeatured, AppWelcome} from "../../../sections/@dashboard/general/app";
import {SeoIllustration} from "../../../assets/illustrations";
import {_appFeatured} from "../../../_mock/arrays";
import {MotionContainer, varFade} from "../../../components/animate";
import Image from '../../../components/image';
import { m } from 'framer-motion';

// ----------------------------------------------------------------------

GeneralHomePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------
const StyledRoot = styled('div')(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(10, 0),
}));

const StyledBg = styled('div')(({ theme }) => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    borderRadius: Number(theme.shape.borderRadius) * 2,
    position: 'absolute',
    transform: 'scaleX(-1)',
    ...bgGradient({
        color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
        imgUrl: '/assets/background/overlay_2.jpg',
    }),
}));

export default function GeneralHomePage() {
    const {user} = useAuthContext();
    console.log('user', user);
    const theme = useTheme();

    const {themeStretch} = useSettingsContext();
    const isDesktop = useResponsive('up', 'sm');
    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <AppWelcome
                            title={`Chào mừng đến với hệ thống quản lý học liệu`}
                            description={`${user.firstName} ${user.lastName}`} 
                            img={
                                <SeoIllustration
                                    sx={{
                                        p: 3,
                                        width: 360,
                                        margin: {xs: 'auto', md: 'inherit'},
                                    }}
                                />
                            }
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <AppFeatured list={_appFeatured}/>
                    </Grid>
                    <Grid item xs={12}>
                        <StyledRoot>
                            <Container
                                component={MotionContainer}
                                sx={{
                                    display: { md: 'flex' },
                                    justifyContent: { md: 'space-between' },
                                }}
                            >
                                <Stack sx={{mt:10,mb:5}}>
                                    <m.div variants={varFade().inUp}>
                                        <Typography variant="h5" sx={{ color: 'text.secondary' }}>

                                            Hệ thống quản lí dạy và học tích hợp
                                            <br />với hệ sinh thái học liệu số mang lại tiện ích đầy đủ.

                                        </Typography>
                                    </m.div>
                                </Stack>

                                {isDesktop && (
                                    <m.div variants={varFade().inDown}>
                                        <Image
                                            disabledEffect
                                            alt="hero"
                                            src="/assets/illustrations/characters/character_7.png"
                                            sx={{ maxWidth: 320 }}
                                        />
                                    </m.div>
                                )}
                            </Container>

                            <StyledBg />
                        </StyledRoot>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
