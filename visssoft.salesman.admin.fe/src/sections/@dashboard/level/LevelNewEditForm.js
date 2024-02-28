import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useEffect, useMemo} from 'react';
// next
import {useRouter} from 'next/router';
// form
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
// @mui
import {LoadingButton} from '@mui/lab';
import {Button, Card, Divider, Grid, Stack, Typography} from '@mui/material';
// utils
// routes
import {PATH_DASHBOARD} from '../../../routes/paths';
// assets
// components
import {useSnackbar} from '../../../components/snackbar';
import FormProvider, {RHFTextField} from '../../../components/hook-form';
import Iconify from "../../../components/iconify";
import {createLevel, updateLevel} from "../../../dataProvider/agent";

// ----------------------------------------------------------------------

LevelNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentLevel: PropTypes.object,
};

export default function LevelNewEditForm({ isEdit = false, currentLevel }) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Tên cấp học không được trống'),
    description: Yup.string().notRequired(),
  })

  const defaultValues = useMemo(
      () => ({
        name: currentLevel?.name || '',
        description: currentLevel?.description || '',
      }),
      [currentLevel]
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
    if (isEdit && currentLevel) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentLevel]);

  const onSubmit = async (data) => {
    if(!isEdit){
      try {
        const res = await createLevel(data)
        if (res.status < 400) {
          reset();
          enqueueSnackbar('Tạo cấp học thành công');
          push(PATH_DASHBOARD.level.list);
        } else {
          enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
      }
    }else{
      try {
        const res = await updateLevel(currentLevel.id,{
          name: data.name,
          description: data.description
        })
        if (res.status < 400) {
          reset();
          enqueueSnackbar('Cập nhật cấp học thành công');
          push(PATH_DASHBOARD.level.list);
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
                        label="Tên cấp học"
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
