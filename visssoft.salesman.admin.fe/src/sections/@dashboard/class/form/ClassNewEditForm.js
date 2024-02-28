import PropTypes from 'prop-types';
import * as Yup from 'yup';
import React, {useCallback, useEffect, useMemo} from 'react';
// next
import {useRouter} from 'next/router';
// form
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
// @mui
import {LoadingButton} from '@mui/lab';
import {Box, Card, Grid, MenuItem, Stack, Typography} from '@mui/material';
// utils
// routes
import {PATH_DASHBOARD} from '../../../../routes/paths';
// components
import {useSnackbar} from '../../../../components/snackbar';
import FormProvider, {RHFSelect, RHFTextField} from '../../../../components/hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {getProgramsRedux} from 'src/redux/slices/program';
import {getGradesRedux} from 'src/redux/slices/grade';

// API
import {postClass, updateClass} from '../../../../dataProvider/agent';
import _ from "lodash";

// ----------------------------------------------------------------------

ClassNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentClass: PropTypes.object,
  onNextStep: PropTypes.func,
  setFormData: PropTypes.func,
  setFormDataStepOne: PropTypes.func,
  formDataStepOne: PropTypes.object,
};

export default function ClassNewEditForm({ isEdit = false, currentClass, onNextStep,setFormData,setFormDataStepOne,formDataStepOne }) {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const { programs } = useSelector((state) => state.program);
  const { grades } = useSelector((state) => state.grade);

  useEffect(() => {
    dispatch(getProgramsRedux({ pageIndex: 1, pageSize: 15 }));
    dispatch(getGradesRedux({ pageIndex: 1, pageSize: 15 }));
  }, [dispatch]);


  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Không được trống'),
    code: Yup.string().required('Không được trống'),
    size: Yup.number().required('Không được trống'),
  })

  const defaultValues = useMemo(
      () => ({
        name: currentClass?.name || '',
        code: currentClass?.code || '',
        size: currentClass?.size || 0,
        schoolYear: currentClass?.schoolYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        gradeId: currentClass?.gradeId + '' || (grades && grades.length) ? grades[0]?.id + '' : '',
        programId: currentClass?.programId + '' || (programs && programs.length) ? programs[0]?.id + '' : '',
      }),
      [currentClass]
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
    if (isEdit && currentClass) {
      reset(defaultValues);
    }
    if (!isEdit && !_.isEmpty(formDataStepOne)) {
        setValue('code',formDataStepOne?.code)
        setValue('name',formDataStepOne?.name)
        setValue('size',formDataStepOne?.size)
        setValue('schoolYear',formDataStepOne?.schoolYear)
        setValue('programId',formDataStepOne?.programId)
        setValue('gradeId',formDataStepOne?.gradeId)
    }
  }, [isEdit, currentClass]);
    console.log('setFormDataStepOne',formDataStepOne)

  const onSubmit = async (data) => {
      console.log('data',data)
    if(!isEdit){
        const dataClass = {
            code: data?.code,
            name: data?.name,
            size: data?.size,
            gradeId: data?.gradeId,
            programId: data?.programId,
            schoolYear: data?.schoolYear,
        }
        try {
            const res = await postClass(dataClass)
            if (res.status < 400) {
                console.log('postClass',res)
                enqueueSnackbar('Tạo lớp học thành công');
                setFormData(res.data.data)
                if(_.isEmpty(formDataStepOne)){
                    setFormDataStepOne(data)
                }
                onNextStep();
            }else {
                enqueueSnackbar(`${res.response.data.title}`, {variant: 'error'});
            }
        } catch (error) {
            enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
        }
    }else{
      try {
        const res = await updateClass(currentClass.id,{
          name: data.name,
          code: data.code,
          size: data.size,
          schoolYear: data.schoolYear,
          gradeId: data.gradeId,
          programId: data.programId,
        })
        if (res.status < 400) {
          reset();
          enqueueSnackbar('Cập nhật lớp học thành công');
          push(PATH_DASHBOARD.class.root);
        } else {
          enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
      }
    }
  };



  const renderYearPicker = useCallback(() => {
    let years = [];
    for (let i = new Date().getFullYear() - 5; i < new Date().getFullYear() + 5; i++) {
      years.push(`${i}-${i + 1}`);
    }
    return years;
  }, []);

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
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Typography variant="h6" sx={{color: 'text.disabled', mb: 1}}>
                Thông tin lớp học
              </Typography>
              <div></div>
              <RHFTextField name="code" label="Mã lớp"  id="code" />
              <RHFTextField name="name" label="Tên lớp"  id="name" />
              <RHFTextField name="size" label="Sĩ số"   type="number" id="size" />
              <RHFSelect
                  id="schoolYear"
                  name="schoolYear"
                  label="Năm học"
                   
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
                {renderYearPicker().map((option, index) => (
                    <MenuItem key={index}
                              value={option}
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
                      {option}
                    </MenuItem>
                ))}
              </RHFSelect>
              <Typography variant="h6" sx={{color: 'text.disabled', mb: 1}}>
                Cài đặt lớp học
              </Typography>
              <div></div>
              <RHFSelect
                  id="programId"
                  name="programId"
                  label="Chương trình học"
                   
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
                {programs.map((option, index) => (
                    <MenuItem key={index}
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
                      {option.name}
                    </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                  id="gradeId"
                  name="gradeId"
                  label="Khối học"
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
                {grades.map((option, index) => (
                    <MenuItem key={index}
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
                      {option.name}
                    </MenuItem>
                ))}
              </RHFSelect>
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
