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
  Card, MenuItem, Alert, FormControl, InputLabel, Select,
} from '@mui/material';
// components
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import FormProvider, { RHFAutocomplete } from '../../../../components/hook-form';
import {addTypeDocumentToSubject, getAllSubject, updateSubjectClass} from '../../../../dataProvider/agent';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import {useAuthContext} from "../../../../auth/useAuthContext";

// ----------------------------------------------------------------------

export default function SubjectAddTypeDocsDialog({ typeDocsId, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const { headOfSubject } = useAuthContext();

  const renderMenuItem = useCallback((item) => {
    if (item && item.length) {
      return item.map((obj, index) => (
          <MenuItem value={obj} key={index}>
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

  const validationSchema = (() => {
    return Yup.object().shape({
      subjectsId: Yup.array().min(1, 'Hãy chọn một môn học'),
    });
  })();

  const defaultValues = useMemo(
    () => ({
      subjectId: '',
    }),
    []
  );

  const methods = useForm({
    // resolver: yupResolver(validationSchema),
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


  const onSubmit = async (data) => {
    console.log('data',typeDocsId,data.subjectId.props.value.id)
    const dataAdd = data.subjectId.props.value.id
    try {
      const res = await addTypeDocumentToSubject(typeDocsId, dataAdd);
      console.log(res);
      if (res.status < 400) {
        enqueueSnackbar('Thêm loại tài liệu vào môn học thành công!');
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
          Thêm loại tài liệu vào môn học
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
                <FormControl sx={{ minWidth: 180 }} size="small">
                  <InputLabel id="demo-simple-select-helper-label">Môn học</InputLabel>
                  <Select
                      id="subjectsId"
                      label="Môn học"
                      onChange={(event, newValue) => {
                        setValue('subjectId', newValue);
                      }}
                  >
                    {renderMenuItem(headOfSubject)}
                  </Select>
                </FormControl>
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
                  Thêm
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Dialog>
  );
}
