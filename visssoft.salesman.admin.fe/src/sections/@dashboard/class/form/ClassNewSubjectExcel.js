import PropTypes from 'prop-types';
import * as Yup from 'yup';
import React, { useMemo, useState } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
// utils
// routes
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider from '../../../../components/hook-form';
import { useDispatch } from 'react-redux';

// API
import { postClass, postFileExcelAddMember, postFileExcelAddSubject } from '../../../../dataProvider/agent';
import { Upload } from "../../../../components/upload";
import Iconify from "../../../../components/iconify";

// ----------------------------------------------------------------------

ClassNewSubjectExcel.propTypes = {
    onNextStep: PropTypes.func,
    onBackStep: PropTypes.func,
    onGotoStep: PropTypes.func,
    setCompleted: PropTypes.func,
};

export default function ClassNewSubjectExcel({ onNextStep, onBackStep, formData, setCompleted, onGotoStep }) {
    const { push } = useRouter();
    const dispatch = useDispatch();
    const [fileSubject, setFileSubject] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const formDataFileMember = new FormData();
    const formDataFileSubject = new FormData();


    const defaultValues = useMemo(
        () => ({
        }),
        []
    );

    const methods = useForm({
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;


    const handleDrop = (acceptedFiles) => {
        try {
            setValue(`fileSubject`, acceptedFiles[0]);
            setFileSubject(acceptedFiles[0]);
        } catch (error) {
            console.error('handleDrop', error);
        }
    };

    const handleRemoveFile = () => {
        setValue(`fileSubject`, '');
        setFileSubject('');

    };

    const onSubmit = async (data) => {
        formDataFileSubject.append('file', data?.fileSubject);
        try {
            if (data.fileSubject === undefined) {
                return enqueueSnackbar(`Bạn chưa thêm file danh sách!`, { variant: 'error' });
            }
            const pushFileSubjectExcel = await postFileExcelAddSubject(formData?.id, formDataFileSubject)
            if (pushFileSubjectExcel.status < 400) {
                enqueueSnackbar('Thêm danh sách môn học thành công');
                setCompleted(true)
                onNextStep();
            } else {
                enqueueSnackbar(`${pushFileSubjectExcel.response.data.title}`, { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
        }
    };



    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} >
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(1, 1fr)',
                            }}
                        >
                            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
                                Danh sách môn học
                            </Typography>
                            <Upload
                                onCLick={() => {
                                    console.log('upload');
                                }}
                                hasDefault
                                accept={{ '.xlsx': [] }}
                                defaultFile={window.location.origin + '/assets/images/subjects/ImportSubjectClass.xlsx'}
                                multiple
                                name={`fileSubject`}
                                error={getValues(`fileSubject`) === ''}
                                files={
                                    getValues(`fileSubject`)
                                        ? [
                                            Object.assign(getValues(`fileSubject`), {
                                                preview: URL.createObjectURL(Object.assign(getValues(`fileSubject`))),
                                            }),
                                        ]
                                        : []
                                }
                                handleDrop={handleDrop}
                                onRemove={handleRemoveFile}
                            />
                        </Box>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Thêm
                            </LoadingButton>
                        </Stack>
                    </Card>

                </Grid>
                <Stack direction='row'>
                    <Button
                        size="small"
                        color="inherit"
                        onClick={onBackStep}
                        sx={{ mt: 2 }}
                        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                    >
                        Trở về
                    </Button>
                    <Button
                        size="small"
                        color="inherit"
                        onClick={() => {
                            setCompleted(true);
                            onNextStep();
                        }}
                        sx={{ mt: 2, ml: 3 }}
                        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                    >
                        Kết thúc
                    </Button>
                </Stack>
            </Grid>
        </FormProvider>
    );
}
