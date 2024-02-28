import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { Controller, useFieldArray, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    Chip,
    Divider,
    FormControl,
    FormControlLabel, FormHelperText,
    Grid, IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
    Item
} from '@mui/material';
// utils
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import * as Yup from 'yup';
// assets
// components
import { DatePicker } from '@mui/x-date-pickers';
import FormProvider, { RHFAutocomplete, RHFRadioGroup, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
import { getALlRoles, getAllSubject, updateUser, createUserAuth } from '../../../dataProvider/agent';
import { yupResolver } from "@hookform/resolvers/yup";

// ----------------------------------------------------------------------
const GENDER_OPTION = [
    { label: 'Nam', value: '0' },
    { label: 'Nữ', value: '1' },
];

UserEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentUser: PropTypes.object,
};

export default function UserEditForm({ isEdit = false, currentUser }) {
    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [isDisabled, setIsDisabled] = useState(false);

    console.log('currentUser', currentUser);
    const validationSchema = (() => {
        if (!isEdit) {
            return Yup.object().shape({
                userName: Yup.string().trim().required('Tên đăng nhập không được trống'),
                password: Yup.string()
                    .required("Mật khẩu không được để trống")
                    .matches(
                        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                        "Mật khẩu phải có ít nhất 8 ký tự, một chữ hoa, một số và một ký tự chữ hoa đặc biệt"
                    ),
                firstName: Yup.string().trim().required('Không được để trống'),
                lastName: Yup.string().trim().required('Không được để trống'),
                email: Yup.string()
                    .trim()
                    .email("Email không đúng định dạng")
                    .max(255, "Vượt quá ký tự cho phép")
                    .required("Email không được trống"),
                phone: Yup.string().required("Không được để trống").matches(/(0[0-9])+([0-9]{8})\b/g, "Số điện thoại phải theo định dạng Ví dụ: 0123456789"),
                address: Yup.mixed().notRequired(),
                id: Yup
                    .array()
                    .min(1),
                items: Yup
                    .array()
                    .min(1),
            });
        } else {
            return Yup.object().shape({
                firstName: Yup.string().trim().required('Không được để trống'),
                lastName: Yup.string().trim().required('Không được để trống'),
                email: Yup.string()
                    .trim()
                    .email("Email không đúng định dạng")
                    .max(255, "Vượt quá ký tự cho phép")
                    .required("Email không được trống"),
                phone: Yup.string().required("Không được để trống").matches(/(0[3|5|7|8|9])+([0-9]{8})\b/g, "Số điện thoại phải theo định dạng 0123456789"),
                address: Yup.mixed().notRequired(),
                items: Yup
                    .array()
                    .min(1),
            });
        }
    })();

    const defaultValues = useMemo(
        () => ({
            userName: currentUser?.userName || '',
            password: currentUser?.password || '',
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            email: currentUser?.email || '',
            gender: currentUser?.gender || 0,
            phone: currentUser?.phone || '',
            address: currentUser?.address || '',
            birthDate: currentUser?.birthDate || new Date(),
            enable: currentUser?.enable || 0,
            isTeacher: 0,
            roleID: [],
            tagsId: [],
            tagsName: '',
            subjectId: [],
            suId: [],
            items: [],
        }),
        [currentUser]
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
        formState: { isSubmitting, errors },
    } = methods;
    const values = watch();

    const { fields, append, prepend, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const renderMenuItem = useCallback((item) => {
        if (item && item?.length) {
            return item.map((obj, index) => (
                <MenuItem
                    value={obj.id}
                    key={index}
                    sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        textTransform: 'capitalize',
                        '&:first-of-type': { mt: 0 },
                        '&:last-of-type': { mb: 0 },
                    }}
                >
                    {obj.name}
                </MenuItem>
            ));
        }
        return (
            <MenuItem>
                <Alert severity="error">Không có dữ liệu!</Alert>
            </MenuItem>
        );
    });

    const handleAdd = () => {
        append({
            id: '',
            subjects: [],
        });
    };

    const handleRemove = (index) => {
        remove(index);
    };


    const [userRole, setUserRole] = useState([]);
    const [userSubjects, setUserSubjects] = useState([]);

    async function fetchRoles() {
        const res = await getALlRoles({ pageIndex: 1, pageSize: 10 });
        if (res.status < 400) {
            setUserRole(res.data.data);
            console.log('userRole', res.data.data);
        } else {
            console.log('error fetch api');
        }
    }

    async function fetchSubject() {
        const res = await getAllSubject({ pageIndex: 1, pageSize: 100 });
        if (res.status < 400) {
            setUserSubjects(res.data.data);
            console.log('UserSubjects', res.data.data);
        } else {
            console.log('error fetch api');
        }
    }

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const onSubmit = async (data) => {
        const rolesData = data.items.map((item) => {
            const subjectIds = item.subjects.map((subject) => subject.id);
            return {
                roleId: item.id,
                subjectId: subjectIds,
            };
        });
        if (!isEdit) {
            try {
                const dataCreate = {
                    userName: data.userName,
                    password: data.password,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    birthDate: data.birthDate,
                    address: data.address,
                    phone: data.phone,
                    isTeacher: data.isTeacher,
                    roles: rolesData,
                };
                const res = await createUserAuth(dataCreate);
                if (res.status < 400) {
                    reset();
                    enqueueSnackbar('Tạo người dùng thành công');
                    push(PATH_DASHBOARD.user.list);
                } else {
                    enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
                }
            } catch (error) {
                enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
            }
        } else {
            const res = await updateUser(currentUser.id, {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                birthDate: data.birthDate,
                address: data.address,
                phone: data.phone,
                enable: data.enable,
                roles: rolesData,
            });
            if (res.status < 400) {
                reset();
                enqueueSnackbar('Cập nhật người dùng thành công');
                push(PATH_DASHBOARD.user.list);
            } else {
                enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
            }
        }
    };

    useEffect(() => {
        if (isEdit && currentUser) {
            setValue('lastName', currentUser.lastName);
            setValue('firstName', currentUser.firstName);
            setValue('gender', currentUser.gender);
            setValue('birthDate', currentUser.birthDate);
            setValue('email', currentUser.email);
            setValue('phone', currentUser.phone);
            setValue('address', currentUser.address);
            setValue('enable', currentUser.enable);
            setValue('items', currentUser.roles);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentUser]);

    useEffect(() => {
        fetchRoles();
        fetchSubject();
    }, []);
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            {!isEdit && (
                                <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
                                    Tài khoản
                                </Typography>
                            )}
                            {!isEdit && <div></div>}
                            {!isEdit && <RHFTextField name="userName" required label="Tên tài khoản" id="userName" />}
                            {!isEdit && (
                                <RHFTextField
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Mật khẩu"
                                    required
                                    id="password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={togglePasswordVisibility}
                                                    edge="end"
                                                    size="large"
                                                    color="secondary"
                                                >
                                                    <Iconify
                                                        icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}

                            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
                                Thông tin cá nhân
                            </Typography>
                            <div></div>
                            <RHFTextField name="firstName" required label="Họ" id="firstName" />
                            <RHFTextField name="lastName" required label="Tên" id="lastName" />
                            <Stack sx={{ ml: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>
                                    Giới tính
                                </Typography>
                                <RHFRadioGroup
                                    name="gender"
                                    options={GENDER_OPTION}
                                    sx={{
                                        mt: 0.5,
                                        '& .MuiFormControlLabel-root': { mr: 4 },
                                    }}
                                />
                            </Stack>
                            <Stack sx={{ mt: 2.5 }}>
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <DatePicker
                                            label="Sinh nhật"
                                            value={field.value}
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} fullWidth error={!!error}
                                                    helperText={error?.message} />
                                            )}
                                        />
                                    )}
                                />
                            </Stack>
                            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
                                Thông tin liên hệ
                            </Typography>

                            <div></div>
                            <RHFTextField name="email" required label="Email" id="email" />
                            <RHFTextField name="phone" label="Số điện thoại" id="phone" />
                            <RHFTextField name="address" label="Địa chỉ" id="address" />
                        </Box>
                        <div></div>
                        <Stack direction="row" spacing={1.5} sx={{ mt: 4 }}>
                            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
                                Cài đặt tài khoản
                            </Typography>
                            <Button
                                size="small"
                                sx={{ display: 'flex', justifyContent: 'flex-start' }}
                                onClick={handleAdd}
                                startIcon={<Iconify icon="eva:plus-fill" />}
                            >
                                Thêm bản ghi
                            </Button>
                        </Stack>

                        {!isEdit && <div></div>}
                        {isEdit && <div></div>}
                        {isEdit && (
                            <FormControlLabel
                                labelPlacement="start"
                                control={
                                    <Controller
                                        name="enable"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                {...field}
                                                checked={field.value !== 1}
                                                onChange={(event) => field.onChange(event.target.checked ? 0 : 1)}
                                            />
                                        )}
                                    />
                                }
                                label={
                                    <>
                                        <Typography variant="subtitle2" sx={{ mb: 0.5, ml: 1 }}>
                                            Vô hiệu hóa/Kích hoạt
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                                            Xác nhận vô hiệu hóa/kích hoạt người dùng
                                        </Typography>
                                    </>
                                }
                                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                            />
                        )}

                        {isEdit && <div></div>}

                        {fields.map((item, index) => {
                            { console.log('item', item) }
                            return (
                                <div key={item.id}>
                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                        <Grid md={6}>
                                            <FormControl
                                                error={!!errors.id}
                                                fullWidth
                                            >
                                                <Controller
                                                    control={control}
                                                    name={`items[${index}].id`}
                                                    render={({
                                                        field: { onChange, onBlur, value, name, ref },
                                                        fieldState: { invalid, isTouched, isDirty, error },
                                                        formState,
                                                    }) => {
                                                        return (
                                                            <>
                                                                <FormControl fullWidth size="medium">
                                                                    <InputLabel>Vai trò</InputLabel>
                                                                    <Select label="Vai trò" onChange={onChange}
                                                                        value={value}>
                                                                        {renderMenuItem(userRole)}
                                                                    </Select>
                                                                </FormControl>
                                                                {!!error && !value?.length && (
                                                                    <FormHelperText error>
                                                                        Vai trò không được trống
                                                                    </FormHelperText>
                                                                )}
                                                            </>
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid md={6}> 
                                            <Controller
                                                name={`items[${index}].subjects`}
                                                control={control}
                                                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                                    <Autocomplete
                                                        value={value}
                                                        disableCloseOnSelect
                                                        multiple
                                                        options={userSubjects}
                                                        getOptionLabel={(option) => option.name}
                                                        onChange={(_, data) => onChange(data)}
                                                        renderTags={(value, getTagProps) =>
                                                            value.map((option, index) => (
                                                                <Chip {...getTagProps({ index })} key={index} size="small"
                                                                    label={option?.name} />
                                                            ))
                                                        }
                                                        renderInput={(params) => <TextField
                                                            label="Môn dạy" {...params} />}

                                                        disabled={
                                                            userRole?.find((item) => item.id === getValues(`items[${index}].id`))?.name !==
                                                            'GIAOVIEN' &&
                                                            userRole?.find((item) => item.id === getValues(`items[${index}].id`))?.name !==
                                                            'TRUONGBOMON' &&
                                                            userRole?.find((item) => item.id === getValues(`items[${index}].id`))?.name !==
                                                            'GVCHUNHIEM'
                                                        }
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Stack>
                                    <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<Iconify icon="eva:trash-2-outline" />}
                                            onClick={() => handleRemove(index)}
                                        >
                                            Gỡ bản ghi
                                        </Button>
                                    </Stack>
                                    <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
                                </div>

                            );
                        })}


                        {errors.items && (
                            <FormHelperText error>
                                Không được trống
                            </FormHelperText>
                        )}
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