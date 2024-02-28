import * as Yup from 'yup';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import _ from 'lodash';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Typography, Divider, Button, Alert } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFSelect, RHFUpload } from '../../../components/hook-form';
// ----------------------------------------------------------------------
import { postDocument, postFile } from '../../../dataProvider/agent';
import { useSelector } from 'react-redux';
import { dispatch } from 'src/redux/store';
import { createDocumentInitialRedux, createDocumentRedux, uploadDocumentRedux } from 'src/redux/slices/folder';
import { Upload } from '../../../components/upload';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/useAuthContext';
import { FileGeneralRecentCard } from "../general/file";

// ----------------------------------------------------------------------
function TextCode() {
    var result = '';

    var alphabet = 'abcdefghijklmnopqrstuvwxyz';
    var num = '0123456789';

    for (var index = 0; index < 4; index++) {
        if (Math.floor(Math.random() * 2) === 0) {
            result += alphabet.charAt(Math.floor(Math.random() * alphabet.length)).toUpperCase();
        } else {
            result += num.charAt(Math.floor(Math.random() * num.length));
        }
    }

    return result;
}

export default function BlogNewPostForm({ dataGeneralFolder, dataUploadDocsToSlot }) {
    const { user } = useAuthContext();
    const formData = new FormData();
    const {
        query: { folder_id: folderId },
        push,
    } = useRouter();

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

    const { id, programs, typeDocuments } = newDocument.init;

    const [file, setFile] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    const defaultValues = useMemo(() => ({
        items: [
            {
                code: `${TextCode()}-${TextCode()}-${TextCode()}-${TextCode()}`,
                description: '',
                file: '',
                name: '',
                programId: '',
                subjectId: '',
                typeDocumentId: '',
            },
        ],
    }));

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
    const { fields, append, prepend, remove } = useFieldArray({
        control,
        name: 'items',
    });

    useEffect(() => {
        dispatch(createDocumentInitialRedux());
    }, []);

    console.log('BlogNewPostForm', getValues('items'));
    const handleDrop = (acceptedFiles, index) => {
        try {
            setValue(`items[${index}].file`, acceptedFiles[0]);
            setFile(acceptedFiles[0]);
            console.log('handleDrop', getValues('items'));
        } catch (error) {
            console.error('handleDrop', error);
        }
    };

    const onSubmit = async ({ items }) => {
        console.log('onSubmit', items);
        for (let index = items.length - 1; index >= 0; --index) {
            try {
                const data = items[index];

                formData.append('File', getValues(`items[${index}].file`));
                const response = await postFile(formData);
                if (response.status !== 200) {
                    enqueueSnackbar(`Tạo tài liệu${data.code} thất bại`, { variant: 'error' });
                    continue;
                }
                console.log('response', response);

                data.TypeFile = response.data.contentType;
                data.urlDocument = response.data.fileName;
                data.size = response.data.size;

                if (!data.programId) {
                    data.programId = programs[0].id;
                }
                if (!data.subjectId) {
                    data.subjectId = user.subjects[0].id;
                }
                if (!data.typeDocumentId) {
                    data.typeDocumentId = typeDocuments[0].id;
                }
                data.folderId = dataGeneralFolder ? dataGeneralFolder.generalFolderId : folderId;
                const message = await dispatch(createDocumentRedux(data));
                if (message) {
                    enqueueSnackbar(message.title, { variant: message.variant });
                }
                remove(index);
            } catch (error) {
                console.error(`onSubmit error at index: ${index}`, error);
            }
        }
        // items.map((data, index) => {
        //   data.status = data.status ? 1 : 0;
        //   dispatch(uploadDocumentRedux(data)).then(() => {
        //     enqueueSnackbar('Tạo tài liệu thành công');
        //     push(PATH_DASHBOARD.folder.link(folderId));
        //   });
        // });
    };

    const handleRemoveFile = (indexLocal) => {
        console.log('handleRemoveFile', indexLocal);
        setValue(`items[${indexLocal}].file`, '');
        setFile('');
        // const filtered = files.filter((file) => file !== inputFile);
        // setFiles(filtered);
        // setValue('file', []);
    };

    const handleAdd = () => {
        prepend({
            code: `${TextCode()}-${TextCode()}-${TextCode()}-${TextCode()}`,
            description: '',
            name: '',
            file: '',
            programId: '',
            subjectId: '',
            typeDocumentId: '',
        });
    };

    const handleRemove = (index) => {
        remove(index);
    };
    console.log('Blog', fields);
    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                {fields.map((item, index) => (
                    <div key={item.code}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={7}>
                                <Card sx={{ p: 3 }}>
                                    <Stack spacing={3}>
                                        <RHFTextField name={`items[${index}].code`} label="Mã tài liệu" />
                                        <RHFTextField name={`items[${index}].name`} label="Tên tài liệu" />

                                        <RHFTextField name={`items[${index}].description`} label="Mô tả" multiline rows={3} />

                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                                Tập tin
                                            </Typography>

                                            <Upload
                                                onCLick={() => {
                                                    console.log('upload');
                                                }}
                                                multiple
                                                name={`items[${index}].file`}
                                                indexLocal={index}
                                                error={getValues(`items[${index}].file`) === ''}
                                                files={
                                                    getValues(`items[${index}].file`)
                                                        ? [
                                                            Object.assign(getValues(`items[${index}].file`), {
                                                                preview: URL.createObjectURL(Object.assign(getValues(`items[${index}].file`))),
                                                            }),
                                                        ]
                                                        : []
                                                }
                                                handleDrop={handleDrop}
                                                onRemove={handleRemoveFile}
                                            />
                                        </Stack>
                                    </Stack>
                                </Card>
                            </Grid>
                            {!dataUploadDocsToSlot.disableChooseOptions ? (
                                <Grid item xs={12} md={5}>
                                    <Card sx={{ p: 3 }}>
                                        <Stack spacing={3}>
                                            {/* <div>
                      <RHFSwitch
                        name="status"
                        label="Tài liệu công khai/ riêng tư"
                        labelPlacement="start"
                        sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                      />
                    </div> */}

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Chương Trình</span>
                                                <RHFSelect name={`items[${index}].programId`} placeholder="Chương trình">
                                                    {programs.map((option, index) => (
                                                        <option key={index} value={option.id}>
                                                            {option.name}
                                                        </option>
                                                    ))}
                                                </RHFSelect>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Môn học</span>
                                                <RHFSelect name={`items[${index}].subjectId`} placeholder="Môn học">
                                                    {user.subjects.map((option, index) => (
                                                        <option key={index} value={option.id}>
                                                            {option.name}
                                                        </option>
                                                    ))}
                                                </RHFSelect>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Loại</span>
                                                <RHFSelect name={`items[${index}].typeDocumentId`} placeholder="Loại tài liệu">
                                                    {typeDocuments.map((option, index) => (
                                                        <option key={index} value={option.id}>
                                                            {option.name}
                                                        </option>
                                                    ))}
                                                </RHFSelect>
                                            </div>
                                        </Stack>
                                    </Card>

                                    <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<Iconify icon="eva:trash-2-outline" />}
                                            onClick={() => handleRemove(index - 1)}
                                        >
                                            Gỡ bản ghi
                                        </Button>
                                    </Stack>
                                </Grid>
                            ) : (
                                <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                                    <Button
                                        size="small"
                                        color="error"
                                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                                        onClick={() => handleRemove(index - 1)}
                                    >
                                        Gỡ bản ghi
                                    </Button>
                                </Stack>
                            )}

                        </Grid>

                        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
                    </div>
                ))}

                <Stack
                    spacing={2}
                    direction={{ xs: 'column-reverse', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    sx={{ mt: -2, mb: 1 }}
                >
                    <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAdd} sx={{ flexShrink: 0 }}>
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
                            Đăng tải tài liệu
                        </LoadingButton>
                    </Stack>
                </Stack>
            </FormProvider>
        </>
    );
}
