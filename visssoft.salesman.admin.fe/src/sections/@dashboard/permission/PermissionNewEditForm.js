import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// utils
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// assets
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { createPermission, getAllPermission, updatePermission } from "../../../dataProvider/agent";

// ----------------------------------------------------------------------

PermissionNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentPermission: PropTypes.object,
};

export default function PermissionNewEditForm({ isEdit = false, currentPermission }) {
    const { push } = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required('Tên quyền không được trống'),
        description: Yup.string().notRequired(),
    })

    const defaultValues = useMemo(
        () => ({
            name: currentPermission?.name || '',
            description: currentPermission?.description || '',
            permissionId: [],
            tagsId: [],
        }),
        [currentPermission]
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
        handleSubmit,
        formState: { isSubmitting },
    } = methods;


    useEffect(() => {
        if (isEdit && currentPermission) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentPermission]);


    const [permissions, setPermissions] = useState([]);


    useEffect(() => {
        fetchPermissions();
    }, []);


    async function fetchPermissions() {
        const res = await getAllPermission({ pageIndex: 1, pageSize: 100 });
        if (res.status < 400) {
            const transformData = res.data.data.map((tag) => {
                return {
                    label: tag.name,
                    id: tag.id,
                };
            });
            console.log(transformData)
            setPermissions(transformData);
        } else {
            console.log('error fetch api');
        }
    }

    const onSubmit = async (data) => {
        console.log('data', data)
        if (!isEdit) {
            try {
                const res = await createPermission(data)
                if (res.status < 400) {
                    reset();
                    enqueueSnackbar('Tạo quyền thành công!');
                    push(PATH_DASHBOARD.permission.list);
                } else {
                    enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
                }
            } catch (error) {
                enqueueSnackbar('Đã có lỗi xảy ra!', { variant: 'error' });
            }
        } else {
            try {
                const res = await updatePermission(currentPermission.id, {
                    name: data.name,
                    description: data.description,
                })
                if (res.status < 400) {
                    reset();
                    enqueueSnackbar('Cập nhật quyền thành công!');
                    push(PATH_DASHBOARD.permission.list);
                } else {
                    enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
                }
            } catch (error) {
                enqueueSnackbar('Đã có lỗi xảy ra!', { variant: 'error' });
            }
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
                                Thông tin quyền
                            </Typography>
                            <RHFTextField
                                name="name"
                                label="Mã quyền"
                                id="name"

                            />
                            <RHFTextField
                                name="description"
                                label="Mô tả quyền"
                                id="description"

                            />
                        </Box>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!isEdit ? 'Tạo mới' : 'Cập nhật'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
