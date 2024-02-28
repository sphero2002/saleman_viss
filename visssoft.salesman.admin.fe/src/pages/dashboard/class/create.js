// next
import Head from 'next/head';
// @mui
import { Container, Grid } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import ClassNewForm from '../../../sections/@dashboard/class/form/ClassNewForm';
import CheckoutSteps from "../../../sections/@dashboard/class/form/NewClassSteps";
import NewClassSteps from "../../../sections/@dashboard/class/form/NewClassSteps";
import { ClassNewStudentExcel, ClassNewSubjectExcel } from "../../../sections/@dashboard/class/form";
import { useSelector } from "react-redux";
import ClassAddComplete from "../../../sections/@dashboard/class/form/ClassAddComplete";
import { useRouter } from "next/router";
import { dispatch } from "../../../redux/store";
import { backStep, gotoStep, nextStep, resetAddClass } from "../../../redux/slices/class";
import { useState } from "react";

// ----------------------------------------------------------------------

CreatNewClassPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------
const STEPS = ['Thông tin cơ bản', 'Danh sách thành viên', 'Danh sách môn học'];

export default function CreatNewClassPage() {
    const { themeStretch } = useSettingsContext();
    const { steps } = useSelector((state) => state.class);
    const { replace } = useRouter();
    const { activeStep } = steps;
    console.log('activeStep', activeStep)
    const [formData, setFormData] = useState({})
    const [formDataStepOne, setFormDataStepOne] = useState({})
    const [completed, setCompleted] = useState(false)


    const handleNextStep = () => {
        dispatch(nextStep());
    };

    const handleBackStep = () => {
        dispatch(backStep());
    };

    const handleGotoStep = (step) => {
        dispatch(gotoStep(step));
    };

    const handleReset = () => {
        if (completed) {
            dispatch(resetAddClass());
            replace(PATH_DASHBOARD.class.root);
        }
    };


    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Tạo lớp học"
                    links={[
                        {
                            name: 'Trang chủ',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Danh sách lớp học',
                            href: PATH_DASHBOARD.class.root,
                        },
                        {
                            name: 'Tạo mới',
                        },
                    ]}
                />
                <ClassNewForm
                    onNextStep={handleNextStep}
                    setFormData={setFormData}
                    setFormDataStepOne={setFormDataStepOne}
                    formDataStepOne={formDataStepOne}
                />
            </Container>
        </>
    );
}
