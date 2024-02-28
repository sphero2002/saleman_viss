import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useCallback, useEffect, useMemo} from 'react';
// next
import {useRouter} from 'next/router';
// form
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
// @mui
import {LoadingButton} from '@mui/lab';
import {Box, Card, Grid, Stack, Typography} from '@mui/material';
// utils
import {fData} from '../../../../utils/formatNumber';
// routes
// assets
// components
import Label from '../../../../components/label';
import {useSnackbar} from '../../../../components/snackbar';
import FormProvider, {RHFSelect, RHFTextField, RHFUploadAvatar} from '../../../../components/hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {getProgramsRedux} from 'src/redux/slices/program';
import {getGradesRedux} from 'src/redux/slices/grade';

// ----------------------------------------------------------------------

ClassNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentClass: PropTypes.object,
};

export default function ClassNewEditForm({ isEdit = false, currentClass }) {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const { programs } = useSelector((state) => state.program);
  const { grades } = useSelector((state) => state.grade);

  useEffect(() => {
    dispatch(getProgramsRedux({ pageIndex: 1, pageSize: 15 }));
    dispatch(getGradesRedux({ pageIndex: 1, pageSize: 15 }));
  }, [dispatch]);

  const { enqueueSnackbar } = useSnackbar();

  const NewClassSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    code: Yup.string().required('Code is required'),
    size: Yup.number()
      .required('ERROR: The number is required!')
      .test('Is positive?', 'ERROR: The number must be greater than 0!', (value) => value > 0),
    schoolYear: Yup.string().required('School Year is required'),
    gradeId: Yup.number()
      .required('ERROR: The number is required!')
      .test('Is positive?', 'ERROR: The number must be greater than 0!', (value) => value > 0),
    programId: Yup.number()
      .required('ERROR: The number is required!')
      .test('Is positive?', 'ERROR: The number must be greater than 0!', (value) => value > 0),
    member: Yup.array().required('member is array'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentClass?.name || '',
      code: currentClass?.code || '',
      size: currentClass?.size || 0,
      schoolYear: currentClass?.schoolYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      gradeId: currentClass?.gradeId + '' || (grades && grades.length) ? grades[0].id + '' : '',
      programId: currentClass?.programId + '' || (programs && programs.length) ? programs[0].id + '' : '',
      teachers: currentClass?.teachers || [],
      students: currentClass?.students || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentClass]
  );

  const methods = useForm({
    resolver: yupResolver(NewClassSchema),
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

  const values = watch();

  useEffect(() => {
    if (isEdit && currentClass) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentClass]);

  const onSubmit = async (data) => {
    try {
      console.log('onSubmit', data, methods);
      // await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile);
      }
    },
    [setValue]
  );

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
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status === 'active' ? 'success' : 'error'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
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
              <RHFTextField name="code" label="Mã lớp" />
              <RHFTextField name="name" label="Tên lớp" />
              <RHFTextField name="size" label="Sĩ số" type="number" />

              <RHFSelect name="schoolYear" label="Năm học" placeholder="Năm học">
                {renderYearPicker().map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name="programId" label="Chương trình" placeholder="Chương trình">
                {programs.map((option, index) => (
                  <option key={index} value={option.id + ''}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name="gradeId" label="Khối" placeholder="Khối">
                {grades.map((option, index) => (
                  <option key={index} value={option.id + ''}>
                    {option.name}
                  </option>
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
