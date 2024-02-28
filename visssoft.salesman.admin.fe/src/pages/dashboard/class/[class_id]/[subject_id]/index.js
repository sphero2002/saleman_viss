import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../../layouts/dashboard';
import { Container, Grid, Stack, Alert, Typography } from '@mui/material';
import { useSettingsContext } from '../../../../../components/settings';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// component subject
import SysllabusSubject from '../../../../../sections/@dashboard/class/subject/SysllabusSubject';
import DocumentLocal from '../../../../../sections/@dashboard/class/subject/DocumentLocal';
import Head from 'next/head';

//
import { getSubjectById, getDocInClass } from '../../../../../dataProvider/agent';
import UploadDocToSlot from 'src/sections/@dashboard/myclass/popupdiaglog/UploadDocToSlot';
import { getFolderRedux, getFolderUploadDocToSlotInGeneralFolderRedux } from 'src/redux/slices/folder';
import { dispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { getDocumentInClassRedux, getSubjectRedux } from 'src/redux/slices/subject';
import { useAuthContext } from "../../../../../auth/useAuthContext";

index.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const data = {
    types: ['folderUploadDocToSlot'],
    menuDocument: ['preview', 'download', 'delete'],
};

const dataForStudent = {
    types: ['folderUploadDocToSlot'],
    menuDocument: ['preview', 'download'],
};


export default function index() {
    const { themeStretch } = useSettingsContext();
    const { subject, documentInClass } = useSelector((state) => state.subject);
    const { user } = useAuthContext();

    const [docs, setDocs] = useState([]);

    const [slotId, setSlotId] = useState(0);

    const [openFormUploadDocToSLot, setOpenFormUploadDocToSlot] = useState(false);

    const handleOpenFormUploadDocToSlot = (id) => {
        console.log('handleOpenFormUploadDocToSlot', id);
        setSlotId(id);
        setOpenFormUploadDocToSlot(true);
    };

    const handleFormUploadDocToSlot = () => {
        setOpenFormUploadDocToSlot(false);
    };

    const {
        query: { class_id, subject_id },
    } = useRouter();

    useEffect(() => {
        dispatch(getFolderRedux(0, 'folderUploadDocToSlot'));
        dispatch(getFolderRedux(72, 'folderUploadDocToSlotInGeneralFolder'));
    }, []);

    useEffect(() => {
        if (class_id && subject_id) {
            dispatch(getSubjectRedux(subject_id));
            dispatch(getDocumentInClassRedux(class_id, subject_id));
        }
    }, [class_id, subject_id]);

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>

            <Container maxWidth={'xl'}>
                <CustomBreadcrumbs
                    heading="Khung chương trình"
                    links={[
                        { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                        { name: 'Danh sách môn học', href: PATH_DASHBOARD.class.detail(class_id) },
                        { name: `Môn học ${subject.name}` },
                        { name: 'Khung chương trình' },
                    ]}
                />
                <Grid container spacing={5}>
                    <Grid item xs={12} md={12}>
                        <Stack spacing={1}>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Tài liệu chung:
                            </Typography>
                            <DocumentLocal
                                data={{ ...data, class_id: class_id, subject_id: subject_id, slotId: null }}
                                documentInClass={documentInClass}
                                handleOpenFormUploadDocToSlot={handleOpenFormUploadDocToSlot}
                            />
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Stack spacing={1}>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                {' '}
                                Tài liệu từng Tuần:
                            </Typography>
                            {user?.roles.find((role) => role.name != 'HOCSINH') ? (
                                subject?.listSlots?.map((element, index) => (
                                    <SysllabusSubject
                                        document={element}
                                        data={{ ...data, class_id: class_id, subject_id: subject_id }}
                                        key={index}
                                        documentInClass={documentInClass}
                                        handleOpenFormUploadDocToSlot={handleOpenFormUploadDocToSlot}
                                    />
                                ))
                            ) : (
                                subject?.listSlots?.map((element, index) => (
                                    <SysllabusSubject
                                        document={element}
                                        data={{ ...dataForStudent, class_id: class_id, subject_id: subject_id }}
                                        key={index}
                                        documentInClass={documentInClass}
                                        handleOpenFormUploadDocToSlot={handleOpenFormUploadDocToSlot}
                                    />
                                ))
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
            <UploadDocToSlot
                classId={class_id}
                subjectId={subject_id}
                slotId={slotId}
                open={openFormUploadDocToSLot}
                onClose={handleFormUploadDocToSlot}
            />
        </>
    );
}
