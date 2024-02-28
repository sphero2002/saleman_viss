import * as Yup from 'yup';
import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
// next
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Card, Divider, Grid, Stack, Typography, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// routes
//components
import dayjs from "dayjs";
import moment from 'moment';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';
// ----------------------------------------------------------------------
import { postFile, getPeriodActive } from '../../../dataProvider/agent';
import { useSelector } from 'react-redux';
import { dispatch } from 'src/redux/store';
import {
    createDocumentInitialRedux,
    createDocumentInSubjectRedux,
    createDocumentRedux,
    getTypeDocumentBySubjectRedux,
    removeTypeDocumentByIndexRedux,
} from 'src/redux/slices/folder';
import { Upload } from '../../../components/upload';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/useAuthContext';

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

export default function AddDocForm({ data }) {
    const { newDocument } = useSelector((state) => state.folder);
    const { user } = useAuthContext();
    const { programs } = newDocument.init;
    const [periods, setPeriods] = useState([]);
    const [description, setDescription] = useState('');
    const [periodid, setPeriodid] = useState(0);
    const [fromdate, setFromdate] = useState(null);
    const [todate, setTodate] = useState(null);

    // useEffect(() => {
    //   dispatch(createDocumentInitialRedux());
    // }, [dispatch]);

    const validationSchema = (() => {
        return Yup.object().shape({
            items: Yup.array().of(
                Yup.object().shape({
                    name: Yup.string().required('Không được trống!'),
                    code: Yup.string().required('Không được trống!'),
                })
            ),
        });
    })();

    const [file, setFile] = useState([]);
    const [reRender, setReRender] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            items: [
                {
                    code: `${TextCode()}-${TextCode()}-${TextCode()}-${TextCode()}`,
                    description: '',
                    file: '',
                    name: '',
                    programId: _.get(programs, '0') ? _.get(programs, '0').id : '',
                    subjectId: _.get(user, 'subjects.0') ? _.get(user, 'subjects.0').id : '',
                    typeDocumentId: _.get(user, `subjects.0.typeDocuments.0`) ? _.get(user, `subjects.0.typeDocuments.0`).id : '',
                    periodid: 0,
                },
            ],
        },
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
    console.log('AddDocForm', getValues('items'), data, programs, newDocument);

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
        console.log('onSubmit', items, fields);
        for (let index = items.length - 1; index >= 0; --index) {
            try {
                const newFolder = items[index];
                const formData = new FormData();
                formData.append('File', newFolder.file);
                console.log('formData', formData);
                const response = await postFile(formData);
                if (response.status !== 200) {
                    enqueueSnackbar(`Tạo tài liệu${newFolder.code} thất bại`, { variant: 'error' });
                    continue;
                }
                console.log('response', response);

                newFolder.TypeFile = response.data.contentType;
                newFolder.urlDocument = response.data.fileName;
                newFolder.size = response.data.size;

                if (!newFolder.programId) {
                    if (!programs.length) {
                        enqueueSnackbar('Không có chương trình học', { variant: 'error' });
                        continue;
                    }
                    newFolder.programId = programs[0].id;
                }
                if (!newFolder.subjectId) {
                    if (!user.subjects.length) {
                        enqueueSnackbar('Người dùng này không có môn học', { variant: 'error' });
                        continue;
                    }
                    newFolder.subjectId = user.subjects[0].id;
                }
                if (!newFolder.typeDocumentId) {
                    enqueueSnackbar('Môn học này không có loại tài liệu', { variant: 'error' });
                    continue;
                }
                if (!_.isEmpty(data.types)) {
                    newFolder.folderId = data.archiveFolderId;
                } else {
                    enqueueSnackbar('Không xác định được thư mục lưu trữ tài liệu', { variant: 'error' });
                    continue;
                }
                let message;
                if (
                    data.types.find((type) => type === 'folderUploadDocToSlot') ||
                    data.types.find((type) => type === 'folderUploadDocToSlotInGeneralFolder')
                ) {
                    message = await dispatch(createDocumentInSubjectRedux(newFolder, data.types[0]));
                    await data.handleAddDocumentToSlot(message.documentId);
                } else {
                    message = await dispatch(createDocumentRedux(newFolder));
                }
                if (message) {
                    enqueueSnackbar(message.title, { variant: message.variant });
                    if (!message.variant) {
                        remove(index);
                    }
                }
            } catch (error) {
                console.error(`onSubmit error at index: ${index}`, error);
            }
        }
    };

    const handleRemoveFile = (indexLocal) => {
        console.log('handleRemoveFile', indexLocal);
        setValue(`items[${indexLocal}].file`, '');
        setFile('');
    };

    const handleAdd = async () => {
        // await dispatch(getTypeDocumentBySubjectRedux(user.subjects[0].id, fields.length));
        prepend({
            code: `${TextCode()}-${TextCode()}-${TextCode()}-${TextCode()}`,
            description: '',
            name: '',
            file: '',
            programId: _.get(programs, '0') ? _.get(programs, '0').id : '',
            subjectId: _.get(user, 'subjects.0') ? _.get(user, 'subjects.0').id : '',
            typeDocumentId: _.get(user, `subjects.0.typeDocuments.0`) ? _.get(user, `subjects.0.typeDocuments.0`).id : '',
            periodid: 0,
        });
    };

    const handleRemove = async (index) => {
        // await dispatch(removeTypeDocumentByIndexRedux(index));
        remove(index);
    };

    const handlerSubjectChange = async (event, index) => {
        console.log(
            'handlerUserChange',
            event.target.name,
            event.target.value,
            _.findIndex(user.subjects, {
                id: Number.parseInt(event.target.value),
            }),
            _.get(
                user,
                `subjects.${_.findIndex(user.subjects, {
                    id: Number.parseInt(event.target.value),
                })}.typeDocuments.0`
            )
        );
        setValue(event.target.name, event.target.value);
        setValue(
            `items[${index}].typeDocumentId`,
            _.get(
                user,
                `subjects.${_.findIndex(user.subjects, {
                    id: Number.parseInt(event.target.value),
                })}.typeDocuments.0`
            )
                ? _.get(
                    user,
                    `subjects.${_.findIndex(user.subjects, {
                        id: Number.parseInt(event.target.value),
                    })}.typeDocuments.0`
                ).id + ''
                : ''
        );
        setReRender({ [event.target.name]: event.target.value });
        // await dispatch(getTypeDocumentBySubjectRedux(event.target.value));
    };
    const handleChange = (event, index) => {
        setDescription(event.target.value);
        setPeriodid(event.target.value);
        setValue(event.target.name, event.target.value);
        console.log(event.target.value);
    };
    const fetchData = async () => {
        console.log('ON')
        const response = await getPeriodActive();
        const json = await response.data;
        setPeriods(json.data);
    };
    useEffect(() => {
        if (periods.length == 0) {
            fetchData();
        }
        console.log('periods:' + JSON.stringify(periods));
    }, [periods])

    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                {fields.map((item, index) => (
                    <div key={item.code}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5}>
                                <Card sx={{ p: 3 }}>
                                    <Stack spacing={3}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Ngày bắt đầu</span>
                                            <DatePicker
                                                label="Ngày bắt đầu"
                                                name={`items[${index}].fromdate`}
                                                value={fromdate}
                                                onChange={(newValue) => {
                                                    setFromdate(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Ngày kết thúc</span>
                                            <DatePicker
                                                label="Ngày kết thúc"
                                                name={`items[${index}].todate`}
                                                value={todate}
                                                onChange={(newValue) => {
                                                    setTodate(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Chương Trình</span>
                                            <RHFSelect name={`items[${index}].programId`} placeholder="Chương trình">
                                                {!_.isEmpty(programs) &&
                                                    programs.map((option) => (
                                                        <option key={option.id} value={option.id}>
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
                                            <RHFSelect
                                                name={`items[${index}].subjectId`}
                                                onChange={(event) => handlerSubjectChange(event, index)}
                                                placeholder="Môn học"
                                            >
                                                {_.get(user, `subjects`) &&
                                                    user.subjects.map((option) => (
                                                        <option key={option.id} value={option.id}>
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
                                                {
                                                    // _.has(user, 'subjects') &&
                                                    //   !_.isEmpty(user.subjects) &&
                                                    //   Number.parseInt(getValues(`items[${index}].subjectId`)) &&
                                                    //   _.findIndex(user.subjects, {
                                                    //     id: Number.parseInt(getValues(`items[${index}].subjectId`)),
                                                    //   }) &&
                                                    //   user.subjects[
                                                    //     _.findIndex(user.subjects, {
                                                    //       id: Number.parseInt(getValues(`items[${index}].subjectId`)),
                                                    //     })
                                                    //   ].typeDocuments.map((option) => (
                                                    //     <option key={option.id} value={option.id}>
                                                    //       {option.name}
                                                    //     </option>
                                                    //   ))
                                                    _.get(
                                                        user,
                                                        `subjects.${_.findIndex(user.subjects, {
                                                            id: Number.parseInt(getValues(`items[${index}].subjectId`))
                                                                ? Number.parseInt(getValues(`items[${index}].subjectId`))
                                                                : 0,
                                                        })}.typeDocuments`
                                                    ) &&
                                                    _.get(
                                                        user,
                                                        `subjects.${_.findIndex(user.subjects, {
                                                            id: Number.parseInt(getValues(`items[${index}].subjectId`)),
                                                        })}.typeDocuments`
                                                    ).map((option) => (
                                                        <option key={option.id} value={option.id}>
                                                            {option.name}
                                                        </option>
                                                    ))

                                                    // getValues(`items[${index}].programId`) ? () : (user.subjects[0].typeDocuments
                                                    //   .map((option) => (
                                                    //     <option key={option.id} value={option.id}>
                                                    //       {option.name}
                                                    //     </option>
                                                    //   )))

                                                    // !_.isEmpty(typeDocuments[index].typeDocumentInEachRecord) &&
                                                    //   typeDocuments[index].typeDocumentInEachRecord.map((option) => (
                                                    //     <option key={option.id} value={option.id}>
                                                    //       {option.name}
                                                    //     </option>
                                                    //   ))
                                                }
                                            </RHFSelect>
                                        </div>
                                    </Stack>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Card sx={{ p: 3 }}>
                                    <Stack spacing={3}>

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
                    <Stack spacing={2} justifyContent="flex-end" direction={{ xs: 'column', md: 'row' }} sx={{ width: 1 }}>
                        <LoadingButton
                            disabled={getValues('items').length === 0}
                            type="submit"
                            variant="contained"
                            size="large"
                            loading={isSubmitting}
                        >
                            Đăng tải
                        </LoadingButton>
                    </Stack>
                </Stack>
            </FormProvider>
        </>
    );
}
