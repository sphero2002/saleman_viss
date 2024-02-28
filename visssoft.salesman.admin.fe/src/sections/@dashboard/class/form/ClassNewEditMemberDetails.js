import * as Yup from 'yup';
import { useState, useCallback, useEffect, useMemo } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Grid,
  Card,
  Stack,
  Typography,
  Divider,
  Button,
  TextField,
  Chip,
  Autocomplete,
  InputAdornment,
  Avatar,
  Link,
  Box,
} from '@mui/material';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import FormProvider, { RHFSwitch, RHFTextField, RHFSelect, RHFUpload, RHFAutocomplete } from 'src/components/hook-form';
// ----------------------------------------------------------------------
import { updateClassMember } from 'src/dataProvider/agent';
import { useSelector } from 'react-redux';
import { dispatch } from 'src/redux/store';
import { Upload } from 'src/components/upload';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/useAuthContext';
import {
  createAddUserInCLassRedux,
  deleteAddUserInCLassRedux,
  filterSubjectRedux,
  getAllUsersWithInfoRedux,
  getUsersByRoleIdRedux,
  getUsersRedux,
} from 'src/redux/slices/user';

import { getRolesRedux } from 'src/redux/slices/roles';
import { object } from 'prop-types';
import { useSnackbar } from 'notistack';
import SearchNotFound from 'src/components/search-not-found/SearchNotFound';
import { CustomTextField } from 'src/components/custom-input';
import Label from '../../../../components/label';
import { indexedDBLocalPersistence } from 'firebase/auth';

// ----------------------------------------------------------------------
const checkArray = (arrayName) => {
  return arrayName && arrayName.length;
};

export default function FolderNewPostForm({ classID }) {
  const { user } = useAuthContext();
  const formData = new FormData();
  const { pagination, addUserInCLass } = useSelector((state) => state.user);
  const { roles } = useSelector((state) => state.role);
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = (() => {
    return Yup.object().shape({
      items: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required('Name is require!'),
          code: Yup.string().required('Code is require!'),
          description: Yup.string().required('Description is require!'),
        })
      ),
    });
  })();

  const { newDocument } = useSelector((state) => state.folder);

  const defaultValues = useMemo(() => ({
    items: [
      {
        userId: '',
        roleId: '',
        subjectId: [],
      },
    ],
  }));

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
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async ({ items }) => {
    console.log('onSubmit: ', items, addUserInCLass);

    const dataPayload = [];
    for (let index = items.length - 1; index >= 0; --index) {
      try {
        const data = items[index];
        // chuan bi
        const obj = {
          userId: 0,
          userRoleClass: {
            roleId: 0,
            subjectId: [],
          },
        };

        if (data.userId) {
          obj.userId = data.userId;
        } else {
          obj.userId = addUserInCLass[index].users[0].id;
        }

        if (data.roleId) {
          obj.userRoleClass.roleId = data.roleId;
        } else {
          obj.userRoleClass.roleId = addUserInCLass[index].roles[0].id;
        }

        if (data.subjectId.length !== 0) {
          obj.userRoleClass.subjectId = data.subjectId.map((data) => data.id);
        }

        dataPayload.push(obj);
        console.log('data apend: ', data);
      } catch (error) {
        console.error(`onSubmit error at index: ${index}`, error);
      }
    }
    console.log('dataPayload: ', dataPayload);
    const response = await updateClassMember(classID, dataPayload);
    console.log('response data: ', response.response);
    if (response instanceof Error) {
      enqueueSnackbar(` ${response.response?.data.title}`, { variant: 'error' });
    } else {
      enqueueSnackbar(`Thêm người dùng thành công`, { variant: 'success' });
    }
  };

  const handleAdd = async (index) => {
    await dispatch(createAddUserInCLassRedux());
    await dispatch(getAllUsersWithInfoRedux({ pageIndex: 1, pageSize: 20 }, index));
    append({
      userId: '',
      roleId: '',
      subjectId: [],
    });
  };

  const handleRemove = async (index) => {
    await dispatch(deleteAddUserInCLassRedux(indexedDBLocalPersistence));
    remove(index);
  };

  const handlerRoleChange = useCallback((event, index) => {
    console.log('handlerRoleChange', event.target.name, event.target.value);
    setValue(event.target.name, event.target.value);

    dispatch(getUsersByRoleIdRedux({ ...pagination, roleId: event.target.value }, index));
  }, []);

  const handlerUserChange = (event, index, userHandle) => {
    console.log('handlerUserChange', index, userHandle);
    setValue(`items[${index}].userId`, userHandle?.id);
    dispatch(filterSubjectRedux({ user: userHandle, index }));
  };

  const handleSearchAddUserInClass = async (value, reason, index) => {
    console.log('handleSearchAddUserInClass', value, reason);
    if (reason === 'input') {
      await dispatch(getAllUsersWithInfoRedux({ pageIndex: 1, pageSize: 20, searchByName: value }, index));
    }
  };

  const handleGotoProduct = (user) => {
    console.log('handleGotoProduct', user);
    dispatch(handleSearchUserRedux(user));
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleGotoProduct(searchProducts);
    }
  };

  console.log('FolderNewPostForm', getValues('items'), addUserInCLass);
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {fields.map((item, index) => (
          <div key={item.id}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ marginRight: '25px' }}>
                        Người dùng
                      </Typography>

                      <Autocomplete
                        id="user-select-demo"
                        size="medium"
                        sx={{ width: '643px' }}
                        options={addUserInCLass[index].users}
                        inputLabel={'hello'}
                        onInputChange={(event, value, reason) => handleSearchAddUserInClass(value, reason, index)}
                        onChange={(event, userHandle) => handlerUserChange(event, index, userHandle)}
                        getOptionLabel={(user) => ` ${user.firstName} ${user.lastName} `}
                        // -------------------------------------------
                        autoHighlight
                        renderOption={(props, user, { inputValue }) => {
                          const { cover, gender, id, firstName, lastName, email, roles } = user;
                          const matches = match(`${firstName} ${lastName}`, inputValue);
                          const parts = parse(`${firstName} ${lastName}`, matches);
                          return (
                            <li {...props}>
                              <Avatar
                                sx={{ mr: 2 }}
                                      src={window.location.origin +`/assets/images/avatars/avatar_${
                                  (1 - gender) * 10 + (id % 10) + 1
                                }.jpg`}
                              />

                              <Link underline="none">
                                {parts.map((part, index) => (
                                  <Typography
                                    key={index}
                                    component="span"
                                    variant="subtitle2"
                                    color={part.highlight ? 'primary' : 'textPrimary'}
                                  >
                                    {part.text}
                                  </Typography>
                                ))}
                                {roles && roles.length ? (
                                  roles.map((r) =>
                                    r === null || '' ? (
                                      <Label sx={{ ml: 1 }}></Label>
                                    ) : (
                                      <Label
                                        key={r.id}
                                        variant="soft"
                                        color={'success'}
                                        sx={{ ml: 1, textTransform: 'capitalize' }}
                                      >
                                        {r.name}
                                      </Label>
                                    )
                                  )
                                ) : (
                                  <></>
                                )}
                                <br />
                                <Typography component="span" variant="subtitle2" color={'textPrimary'}>
                                  {email}
                                </Typography>
                              </Link>
                            </li>
                          );
                        }}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            placeholder="Tìm kiếm người dùng..."
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </div>

                    {checkArray(addUserInCLass) && checkArray(addUserInCLass[index].roles) ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ marginRight: '25px' }}>
                          Vai trò
                        </Typography>
                        <RHFSelect
                          sx={{ width: '643px' }}
                          name={`items[${index}].roleId`}
                          placeholder="Quyền"
                          onChange={(event) => handlerRoleChange(event, index)}
                        >
                          {addUserInCLass[index].roles.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </RHFSelect>
                      </div>
                    ) : (
                      ''
                    )}

                    {checkArray(addUserInCLass) && checkArray(addUserInCLass[index].subjects) ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom sx={{ marginRight: '25px' }}>
                          Môn học
                        </Typography>
                        <RHFAutocomplete
                          sx={{ width: '643px' }}
                          name={`items[${index}].subjectId`}
                          multiple
                          onChange={(event, newValue) => {
                            console.log('RHFAutocomplete', newValue);
                            setValue(`items[${index}].subjectId`, newValue);
                          }}
                          options={addUserInCLass[index].subjects.length ? addUserInCLass[index].subjects : []}
                          renderTags={(value, getTagProps) =>
                            value.map((option, indexItem) => (
                              <Chip {...getTagProps({ indexItem })} key={indexItem} size="small" label={option.label} />
                            ))
                          }
                          renderInput={(params) => {
                            return <TextField {...params} />;
                          }}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </Stack>
                </Card>

                <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                    onClick={() => handleRemove(index)}
                  >
                    Gỡ
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
          </div>
        ))}

        <Stack
          spacing={2}
          direction={{ xs: 'column-reverse', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Button
            size="small"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => handleAdd(fields.length)}
            sx={{ flexShrink: 0 }}
          >
            Thêm bản ghi
          </Button>

          <Stack spacing={2} justifyContent="flex-end" direction={{ xs: 'column', md: 'row' }} sx={{ width: 1 }}>
            <LoadingButton
              disabled={getValues('items').length === 0}
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
            >
              Thêm người dùng
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </>
  );
}
