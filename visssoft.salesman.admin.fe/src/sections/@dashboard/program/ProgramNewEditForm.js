import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm, Controller } from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from '@mui/lab';
import {Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Divider, Button} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// assets
import { countries } from '../../../assets/data';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import Iconify from "../../../components/iconify";
import {createProgram, createUserAuth, updateProgram} from "../../../dataProvider/agent";
import {useFormik} from "formik";

// ----------------------------------------------------------------------

ProgramNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProgram: PropTypes.object,
};

export default function ProgramNewEditForm({ isEdit = false, currentProgram }) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Tên chương trình không được trống'),
    description: Yup.string().notRequired(),
  })

  const defaultValues = useMemo(
    () => ({
      name: currentProgram?.name || '',
      description: currentProgram?.description || '',
    }),
    [currentProgram]
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
    if (isEdit && currentProgram) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentProgram]);

  const onSubmit = async (data) => {
    if(!isEdit) {
      try {
        const res = await createProgram(data)
        if (res.status < 400) {
          reset();
          enqueueSnackbar('Tạo chương trình học thành công');
          push(PATH_DASHBOARD.program.list);
        } else {
          enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
      }
    }else {
      try {
        const res = await updateProgram(currentProgram.id,{
          name: data.name,
          description: data.description
        })
        if (res.status < 400) {
          reset();
          enqueueSnackbar('Cập nhật chương trình học thành công');
          push(PATH_DASHBOARD.program.list);
        } else {
          enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
      }
    }
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} >
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              Chi tiết:
            </Typography>
            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
              <Stack alignItems="flex-end" spacing={1.5}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <RHFTextField
                        name="name"
                        required
                        label="Tên chương trình"
                        id="name"
                    />
                    <RHFTextField
                        name="description"
                        label="Mô tả"
                        id="description"
                    />
                </Stack>
                <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      reset(defaultValues);
                    }}
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                >
                  Xóa
                </Button>
              </Stack>
            </Stack>
            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

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
