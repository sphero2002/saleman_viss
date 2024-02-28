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
import {Box, Button, Card, Chip, Divider, Grid, MenuItem, Stack, TextField, Typography} from '@mui/material';
// utils
// routes
import {PATH_DASHBOARD} from '../../../routes/paths';
// assets
// components
import {useSnackbar} from '../../../components/snackbar';
import FormProvider, {RHFAutocomplete, RHFRadioGroup, RHFSelect, RHFTextField} from '../../../components/hook-form';
import Iconify from "../../../components/iconify";
import {createGrade, getAllLevel, getALlRoles, updateGrade} from "../../../dataProvider/agent";
import {DatePicker} from "@mui/x-date-pickers";

// ----------------------------------------------------------------------

GradeNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentGrade: PropTypes.object,
};

export default function GradeNewEditForm({ isEdit = false, currentGrade }) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Tên cấp học không được trống'),
    description: Yup.string().notRequired(),
    levelId:  Yup.string().trim().required('Phải chọn cấp học'),
  })

  const defaultValues = useMemo(
      () => ({
        name: currentGrade?.name || '',
        description: currentGrade?.description || '',
        levelId: currentGrade?.levelId || 0
      }),
      [currentGrade]
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
    if (isEdit && currentGrade) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentGrade]);

  const [levels, setLevels] = useState([]);


  useEffect(() => {
    fetchLevels();
  }, []);


  async function fetchLevels() {
    const res = await getAllLevel({pageIndex: 1, pageSize: 100});
    if (res.status < 400) {
      const transformData = res.data.data.map((tag) => {
        return {
          label: tag.name,
          id: tag.id,
        };
      });
      console.log(transformData)
      setLevels(transformData);
    } else {
      console.log('error fetch api');
    }
  }

  const onSubmit = async (data) => {
      if(!isEdit){
          try {
              const res = await createGrade(data)
              if (res.status < 400) {
                  reset();
                  enqueueSnackbar('Tạo khối học thành công');
                  push(PATH_DASHBOARD.grade.list);
              } else {
                  enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
              }
          } catch (error) {
              enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
          }
      }else{
          try {
              const res = await updateGrade(currentGrade.id,{
                  levelId : data.levelId,
                  name: data.name,
                  description: data.description
              })
              console.log(data)
              if (res.status < 400) {
                  reset();
                  enqueueSnackbar('Cập nhật khối học thành công');
                  push(PATH_DASHBOARD.grade.list);
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
          <Grid item xs={12}>
            <Card sx={{p: 3}}>
              <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
              >
                    <Typography variant="h6" sx={{color: 'text.disabled', mb: 1}}>
                      Thông tin khối học
                    </Typography>
                     <div></div>
                    <RHFTextField
                        name="name"
                        required
                        label="Tên khối học"
                        id="name"
                    />
                    <RHFTextField
                        name="description"
                        label="Mô tả"
                        id="description"

                    />
                    <Typography variant="h6" sx={{color: 'text.disabled', mb: 1}}>
                      Cài đặt khối học
                    </Typography>
                    <div></div>
                    <RHFSelect
                        name="levelId"
                        label="Thuộc cấp học"
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{
                          native: false,
                          MenuProps: {
                            PaperProps: {
                              sx: { maxHeight: 220 },
                            },
                          },
                          sx: { textTransform: 'capitalize' },
                        }}
                    >
                      {levels.map((option) => (
                          <MenuItem
                              key={option.id}
                              value={option.id}
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
                            {option.label}
                          </MenuItem>
                      ))}
                    </RHFSelect>

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
