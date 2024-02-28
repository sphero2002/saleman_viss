import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useEffect, useMemo, useState} from 'react';
// next
import {useRouter} from 'next/router';
// form
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
// @mui
import {LoadingButton} from '@mui/lab';
import {
    Box,
    Button,
    Card,
    Chip,
    Divider, FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';
// utils
// routes
import {PATH_DASHBOARD} from '../../../routes/paths';
// assets
// components
import {useSnackbar} from '../../../components/snackbar';
import FormProvider, {RHFAutocomplete, RHFSelect, RHFTextField} from '../../../components/hook-form';
import Iconify from "../../../components/iconify";
import {createRole, createSubject, getAllPermission, updateRole, updateSubject} from "../../../dataProvider/agent";
import SubjectNewEditSlot from "../subject/SubjectNewEditSlot";
import RolesNewEditPermisson from "./RolesNewEditPermission";
import RolesNewEditPermission from "./RolesNewEditPermission";
import RolesNewEditMenu from "./RolesNewEditMenu";

// ----------------------------------------------------------------------

RolesNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentRoles: PropTypes.object,
};

export default function RolesNewEditForm({isEdit = false, currentRoles, permissions, menu}) {
    const {push} = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required('Tên vai trò không được trống'),
        description: Yup.string().trim().max(255, "Tối đa 255 ký tự"),
        permissionId: Yup
            .array()
            .min(1),
        menuId: Yup
            .array()
            .min(1),
    })

    const defaultValues = useMemo(
        () => ({
            name: currentRoles?.name || '',
            description: currentRoles?.description || '',
            permissionId: currentRoles?.permission || [],
            menuId: currentRoles?.menu || [],
        }),
        [currentRoles]
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
        formState: {errors, isSubmitting},
    } = methods;


    useEffect(() => {
        if (isEdit && currentRoles) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentRoles]);


    const onSubmit = async (data) => {
        console.log('data', data)
        if (!isEdit) {
            try {
                const res = await createRole({
                    name: data.name,
                    description: data.description,
                    permissionId: data.permissionId?.map((perm) => perm.id),
                    menuId: data.menuId?.map((menu) => menu.id),
                });
                if (res.status < 400) {
                    reset();
                    enqueueSnackbar('Tạo vai trò thành công');
                    push(PATH_DASHBOARD.role.list);
                } else {
                    enqueueSnackbar('Đã có lỗi xảy ra', {variant: 'error'});
                }
            } catch (error) {
                enqueueSnackbar('Đã có lỗi xảy ra', {variant: 'error'});
            }
        } else {
            try {
                // return console.log('Form data', data);
                const res = await updateRole(currentRoles.id, {
                    name: data.name,
                    description: data.description,
                    permissionId: data.permissionId?.map((perm) => perm.id),
                    menuId: data.menuId?.map((menu) => menu.id),
                });
                if (res.status < 400) {
                    reset();
                    enqueueSnackbar('Cập nhật vai trò thành công!');
                    push(PATH_DASHBOARD.role.list);
                } else {
                    enqueueSnackbar(`${res.response.data.title}`, {variant: 'error'});
                }
            } catch (error) {
                enqueueSnackbar('Đã có lỗi xảy ra !', {variant: 'error'});
            }
        }
    };

    const handleSelectedPermission = (data) => {
        const listPermissionId = [];
        data.map((perm) => {
            listPermissionId.push(perm.id);
        });
        setValue('permissionId', listPermissionId);
    };

    const handleSelectedMenuItems = (data) => {
        const listMenuId = [];
        data.map((menu) => {
            listMenuId.push(menu.id);
        });
        setValue('menuId', listMenuId);
    };


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card sx={{p: 3}}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                        >
                            <Typography variant="h6" sx={{color: 'text.disabled', mb: 1}}>
                                Thông tin vai trò
                            </Typography>
                            <div></div>
                            <RHFTextField
                                required
                                name="name"
                                label="Tên vai trò"
                                id="name"
                            />
                            <RHFTextField

                                name="description"
                                label="Mô tả"
                                id="description"

                            />
                            <FormControl
                                error={!!errors.permissionId}
                            >
                                <Controller
                                    name="permissionId"
                                    control={control}
                                    defaultValue={[]}
                                    render={({
                                                 field: {onChange, onBlur, value, name, ref},
                                                 fieldState: {invalid, isTouched, isDirty, error},
                                             }) => {
                                        return (
                                            <>
                                                <RolesNewEditPermission selectedPermissions={value}
                                                                        permissions={permissions}
                                                                        handleSelectedPermission={handleSelectedPermission}/>
                                                {!!error && !value?.length && (
                                                    <FormHelperText error>
                                                        Quyền không được trống
                                                    </FormHelperText>
                                                )}
                                            </>
                                        );
                                    }}
                                />

                            </FormControl>
                            <FormControl
                                error={!!errors.menuId}
                            >
                                <Controller
                                    name="menuId"
                                    control={control}
                                    defaultValue={[]}
                                    render={({
                                                 field: {onChange, onBlur, value, name, ref},
                                                 fieldState: {invalid, isTouched, isDirty, error},
                                             }) => {
                                        return (
                                            <>
                                                <RolesNewEditMenu selectedMenuItems={value} menuItems={menu}
                                                                  handleSelectedMenuItems={handleSelectedMenuItems}/>
                                                {!!error && !value?.length && (
                                                    <FormHelperText error>
                                                        Danh mục không được trống
                                                    </FormHelperText>
                                                )}
                                            </>
                                        );
                                    }}
                                />

                            </FormControl>

                        </Box>

                        <Stack alignItems="flex-end" sx={{mt: 3}}>
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
