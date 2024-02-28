import * as Yup from 'yup';
import { useCallback } from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
// @mui
import { Box, Grid, Card, Stack, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// utils
import { fData } from '../../../../utils/formatNumber';
// assets
import { countries } from '../../../../assets/data';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFRadioGroup,
} from '../../../../components/hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import {updateProfile, updateUser} from '../../../../dataProvider/agent';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------
const GENDER_OPTION = [
  { label: 'Nam', value: '0' },
  { label: 'Nữ', value: '1' },
];

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('Không được để trống'),
    lastName: Yup.string().trim().required('Không được để trống'),
    phone: Yup.string().required("Không được để trống").matches(/(0[0-9])+([0-9]{8})\b/g,"Số điện thoại phải theo định dạng Ví dụ: 0123456789"),

  });

  const defaultValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    gender: user?.gender || 0,
    phone: user?.phone || '',
    birthDate: user?.birthDate || new Date(),
    address: user?.address || '',
    roles: user?.roles || [],
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const roles = [];
    const userRole = user.roles;
    const subject = user.subjects;
    userRole.forEach((item) => {
      if (item.name == 'GIAOVIEN') {
        roles.push({
          roleId: item.id,
          subjectId: subject.map((item) => item.id),
        });
      } else {
        roles.push({
          roleId: item.id,
          subjectId: [],
        });
      }
    });
    const dataPut = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      birthDate: data.birthDate,
      address: data.address,
      phone: data.phone,
      roles: roles,
    };
    try {
      const res = await updateProfile(dataPut);
      if (res.status < 400) {
        enqueueSnackbar('Cập nhật thành công');
        window.location.reload();
      } else {
        enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
      console.error(error);
    }
  };

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
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Sinh nhật"
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(new Date(newValue));
                        console.log(new Date(newValue));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                      )}
                    />
                  )}
                />
              </Stack>
              <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
                Thông tin liên hệ
              </Typography>

              <div></div>
              <RHFTextField name="email" disabled label="Email" id="email" />
              <RHFTextField name="phone" label="Số điện thoại" id="phone" />
              <RHFTextField name="address" label="Địa chỉ" id="address" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Cập nhật
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
