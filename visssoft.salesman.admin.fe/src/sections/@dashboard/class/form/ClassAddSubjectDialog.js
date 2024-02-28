// @mui
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  Divider,
  Tab,
  Tabs,
  Stack,
  TextField,
  Typography,
  Grid,
  Card,
} from '@mui/material';
// components
import React, { useEffect, useMemo, useState } from 'react';
import FormProvider, { RHFAutocomplete } from '../../../../components/hook-form';
import { getAllSubject, updateSubjectClass } from '../../../../dataProvider/agent';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function ClassAddSubjectDialog({ fetchMyClass, classID, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = (() => {
    return Yup.object().shape({
      subjectsId: Yup.array().min(1, 'Hãy chọn một môn học'),
    });
  })();

  const defaultValues = useMemo(
    () => ({
      tagsId: [],
      subjectsId: [],
      subjectId: '',
    }),
    []
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

  const [subjectsData, setSubjectsData] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    const res = await getAllSubject({ pageIndex: 1, pageSize: 150 });
    if (res.status < 400) {
      const transformData = res.data.data.map((tag) => {
        return {
          label: tag.name,
          id: tag.id,
        };
      });
      setSubjectsData(transformData);
    } else {
      console.log('error fetch api');
    }
  }

  const onSubmit = async (data) => {
    let postData = [];

    for (let i = 0; i < data.tagsId.length; i++) {
      postData.push({
        subjectId: data.tagsId[i],
      });
    }
    try {
      const res = await updateSubjectClass(classID, postData);
      console.log(res);
      if (res.status < 400) {
        await fetchMyClass();
        enqueueSnackbar('Thêm môn học vào lớp học thành công!');
        onClose();
      } else {
        enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Thêm môn học
        </Typography>
      </DialogActions>

      <Divider />
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
                  sm: 'repeat(1, 1fr)',
                }}
              >
                <RHFAutocomplete
                  name="subjectsId"
                  multiple
                  onChange={(event, newValue) => {
                    setValue('subjectsId', newValue);
                    const tagsId = newValue.map((tag) => tag.id);
                    setValue('tagsId', tagsId);
                  }}
                  options={subjectsData}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip {...getTagProps({ index })} key={index} size="small" label={option.label} />
                    ))
                  }
                  renderInput={(params) => <TextField label="Môn học" {...params} />}
                />
              </Box>
              <Stack justifyContent="flex-end" direction="row" spacing={1.5} sx={{ mt: 3 }}>
                <LoadingButton
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Quay lại
                </LoadingButton>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Thêm mới
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Dialog>
  );
}
