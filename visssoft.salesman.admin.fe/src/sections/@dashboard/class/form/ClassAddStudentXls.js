import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {Box, Stack, Card, Grid, Typography} from '@mui/material';
import FormProvider, {RHFUpload} from "../../../../components/hook-form";
import {Upload} from "../../../../components/upload";
import {useForm} from "react-hook-form";
import * as Yup from "yup";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {LoadingButton} from "@mui/lab";
import {yupResolver} from "@hookform/resolvers/yup";
import {createManyUser, postFileExcelAddMember} from "../../../../dataProvider/agent";
import {PATH_DASHBOARD} from "../../../../routes/paths";

export default function ClassAddStudentXls(classID) {
    const {push} = useRouter();

    const formDataFileUser = new FormData();

    const [files, setFiles] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    const validationSchema = Yup.object().shape({
    })

    const defaultValues = useMemo(
        () => ({

        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(validationSchema),
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


    useEffect(() => {
        if (!open) {
            setFiles([]);
        }
    }, [open]);

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
        try {
            if(data.file === undefined){
                return enqueueSnackbar(`Bạn chưa thêm file danh sách!`, { variant: 'error' });
            }
            formDataFileUser.append('file', data.file);
            const res = await postFileExcelAddMember(classID?.classID, formDataFileUser)
            if(res.status < 400){
                enqueueSnackbar('Thêm danh sách thành viên vào lớp học thành công');
                push(PATH_DASHBOARD.class.detail(classID?.classID));
            }else{
                enqueueSnackbar(`${res.response.data.title}`, {variant: 'error'});
            }
        }catch (error){
            enqueueSnackbar(`Đã có lỗi xảy ra!`, { variant: 'error' });
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card sx={{p: 3}}>
                        <Stack spacing={3}>
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" sx={{color: 'text.secondary'}}>
                                    Danh sách học sinh
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
                            </Stack>
                            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                    Đăng tải
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    </Card>

                </Grid>
            </Grid>
        </FormProvider>
    )
}
