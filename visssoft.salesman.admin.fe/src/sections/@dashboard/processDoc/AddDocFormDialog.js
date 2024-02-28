import PropTypes from 'prop-types';
import * as Yup from 'yup';
import _ from 'lodash';
// @mui
import { LoadingButton } from '@mui/lab';
import {
    Box,
    Button,
    Card,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Tab,
    Tabs,
    Typography, Grid, Stack, TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import moment from 'moment';
// components
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Scrollbar from '../../../components/scrollbar';
import { Upload } from '../../../components/upload';
import React, { useCallback, useEffect, useState } from 'react';
import { getDocumentById, getGradeById } from '../../../dataProvider/agent';
import ManageSubject from '../class/manage/ManageSubject';
import ManageUser from '../class/manage/ManageUser';
import { useSelector } from 'react-redux';
import { dispatch } from 'src/redux/store';
import { copyDocsToFolderRedux, copyDocsToStoreFolderRedux, getFolderRedux } from 'src/redux/slices/folder';
import { AddDocForm, GeneralFilePage } from '../folder';
import { useSnackbar } from 'notistack';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
// ----------------------------------------------------------------------

// UploadMyDocumentDialog.propTypes = {
//   open: PropTypes.bool,
//   onClose: PropTypes.func,
// };

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
export default function AddDocFormDialog({ open, onClose }) {
    const { newDocument } = useSelector((state) => state.folder);
    const { user } = useAuthContext();
    const { programs } = newDocument.init;
    const [periods, setPeriods] = useState([]);
    const [description, setDescription] = useState('');
    const [periodid, setPeriodid] = useState(0);
    const [fromdate, setFromdate] = useState(null);
    const [todate, setTodate] = useState(null);

    const { folderUploadDoc, storeFolder } = useSelector((state) => state.folder);
    const { enqueueSnackbar } = useSnackbar();

    const [currentTab, setCurrentTab] = useState(0);

    const [files, setFiles] = useState([]);

    const handleUploadDocumentToStoreFolder = async (myDocumentId) => {
        const message = await dispatch(copyDocsToStoreFolderRedux(storeFolder.id, myDocumentId));
        if (message) {
            enqueueSnackbar(message.title, { variant: message.variant });
        }
    };

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
    //console.log('AddDocForm', getValues('items'), data, programs, newDocument);

    const handleDrop = useCallback(
        async (acceptedFiles) => {
            try {               
                const newFiles = acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                );
                setFiles([...files, ...newFiles]);
                setValue('file', [...files, ...newFiles]);
            } catch (error) {
                console.error('handleDrop', error);
            }
        },
        [setValue],
        [files]
    );

    const onSubmit = async ({ items }) => {

    };

    const handleRemoveFile = (indexLocal) => {
        console.log('handleRemoveFile', indexLocal);
        setValue(`items[${indexLocal}].file`, '');
        setFile('');
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
    };
    useEffect(() => {
        if (periods.length == 0) {
            fetchData();
        }
        console.log('periods:' + JSON.stringify(periods));
    }, [periods])

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            open={open}
            onClose={() => {
                onClose();
            }}
        >
            <DialogActions sx={{ py: 2, px: 3 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Đăng tải tài liệu của tôi
                </Typography>

                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                        onClose();
                    }}
                >
                    Quay lại
                </Button>
            </DialogActions>

            <Divider />
            <Container maxWidth={'xl'}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <Card sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Ngày bắt đầu</span>
                                        <DatePicker
                                            label="Ngày bắt đầu"
                                            name="fromdate"
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
                                            name="todate"
                                            value={todate}
                                            onChange={(newValue) => {
                                                setTodate(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Chương Trình</span>
                                        <RHFSelect name="programId" placeholder="Chương trình">
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
                                            name="subjectId"
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
                                        <RHFSelect name="typeDocumentId" placeholder="Loại tài liệu">
                                            {
                                                _.get(
                                                    user,
                                                    `subjects.${_.findIndex(user.subjects, {
                                                        id: Number.parseInt(getValues(`subjectId`))
                                                            ? Number.parseInt(getValues(`subjectId`))
                                                            : 0,
                                                    })}.typeDocuments`
                                                ) &&
                                                _.get(
                                                    user,
                                                    `subjects.${_.findIndex(user.subjects, {
                                                        id: Number.parseInt(getValues(`subjectId`)),
                                                    })}.typeDocuments`
                                                ).map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))

                                            }
                                        </RHFSelect>
                                    </div>
                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Card sx={{ p: 3 }}>
                                <Stack spacing={3}>

                                    <RHFTextField name={`description`} label="Mô tả" multiline rows={3} />

                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                            Tập tin
                                        </Typography>

                                        <Upload name="file" multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
                                    </Stack>
                                </Stack>
                            </Card>
                        </Grid>

                    </Grid>
                    <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
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
            </Container>
        </Dialog>
    );
}
