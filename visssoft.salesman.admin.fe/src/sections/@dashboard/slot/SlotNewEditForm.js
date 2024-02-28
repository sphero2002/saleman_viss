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
import {createSlot, updateSlot} from "../../../dataProvider/agent";

// ----------------------------------------------------------------------

SlotNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentSlot: PropTypes.object,
};

export default function SlotNewEditForm({ isEdit = false, currentSlot }) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Tên tiết học không được trống'),
  })

  const defaultValues = useMemo(
      () => ({
        name: currentSlot?.name || '',
      }),
      [currentSlot]
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
    if (isEdit && currentSlot) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentSlot]);

  const onSubmit = async (data) => {
    if(!isEdit){
      try {
        const res = await createSlot(data)
        if (res.status < 400) {
          reset();
          enqueueSnackbar('Tạo tiết học thành công');
          push(PATH_DASHBOARD.slot.list);
        } else {
          enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
      }
    }else{
      try {
        const res = await updateSlot(currentSlot.id,{
          name: data.name,
        })
        if (res.status < 400) {
          reset();
          enqueueSnackbar('Cập nhật tiết học thành công');
          push(PATH_DASHBOARD.slot.list);
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
                        label="Tên tiết học"
                        id="name"
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
