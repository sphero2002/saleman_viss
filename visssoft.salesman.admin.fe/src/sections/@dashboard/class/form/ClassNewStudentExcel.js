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
import { Upload } from "../../../../components/upload";
import Iconify from "../../../../components/iconify";
import { postFileExcelAddMember } from "../../../../dataProvider/agent";

// ----------------------------------------------------------------------

ClassNewStudentExcel.propTypes = {
    onNextStep: PropTypes.func,
    onBackStep: PropTypes.func,
    onGotoStep: PropTypes.func,
};

export default function ClassNewStudentExcel({ onNextStep, onBackStep, formData, onGotoStep }) {
    console.log('ClassNewStudentExcel', formData)
    const { push } = useRouter();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const formDataFileMember = new FormData();

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

    const [files, setFiles] = useState([]);

    const handleDrop = (acceptedFiles) => {
        try {
            setValue(`file`, acceptedFiles[0]);
            setFiles(acceptedFiles[0]);
        } catch (error) {
            console.error('handleDrop', error);
        }
    };

    const handleRemoveFile = () => {
        setValue(`file`, '');
        setFiles('');

    };

    const onSubmit = async (data) => {
        const fileStudent = getValues(`file`)
        formDataFileMember.append('file', data?.file);
        try {
            if (data.file === undefined) {
                return enqueueSnackbar(`Bạn chưa thêm file danh sách!`, { variant: 'error' });
            }
            const pushFileStudentExcel = await postFileExcelAddMember(formData?.id, formDataFileMember)
            if (pushFileStudentExcel.status < 400) {
                enqueueSnackbar('Thêm danh sách thành viên lớp học thành công');
                onNextStep();
            } else {
                enqueueSnackbar(`${pushFileStudentExcel.response.data.title}`, { variant: 'error' });
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
                                Danh sách thành viên
                            </Typography>

                            <Upload
                                onCLick={() => {
                                    console.log('upload');
                                }}
                                hasDefault
                                defaultFile={window.location.origin + '/assets/images/subjects/ImportMemberClass.xlsx'}
                                accept={{ '.xlsx': [] }}
                                multiple
                                name={`file`}
                                error={getValues(`file`) === ''}
                                files={
                                    getValues(`file`)
                                        ? [
                                            Object.assign(getValues(`file`), {
                                                preview: URL.createObjectURL(Object.assign(getValues(`file`))),
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
                        onClick={onNextStep}
                        sx={{ mt: 2, ml: 3 }}
                        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                    >
                        Tiếp theo
                    </Button>
                </Stack>
            </Grid>
        </FormProvider>
    );
}
