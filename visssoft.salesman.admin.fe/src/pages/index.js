import {m, useScroll, useSpring} from 'framer-motion';
// next
import Head from 'next/head';
// @mui
import {useTheme} from '@mui/material/styles';
import {Box} from '@mui/material';
// layouts
import MainLayout from '../layouts/main';
// sections
import {
    HomeHero,
    HomeMinimal,
    HomeDarkMode,
    HomeLookingFor,
    HomeForDesigner,
    HomeColorPresets,
    HomePricingPlans,
    HomeAdvertisement,
    HomeCleanInterfaces,
    HomeHugePackElements,
} from '../sections/home';

// ----------------------------------------------------------------------

HomePage.getLayout = (page) => <MainLayout> {page} </MainLayout>;

// ----------------------------------------------------------------------

export default function HomePage() {

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>

            <HomeHero/>

        </>
    );
}
