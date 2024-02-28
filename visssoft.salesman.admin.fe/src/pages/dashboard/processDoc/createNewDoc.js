import { paramCase } from 'change-case';
import { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import _ from 'lodash';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui 
import { LoadingButton } from '@mui/lab';
import {
    DataGrid, GridColDef, GridRowModes, GridToolbarContainer, GridActionsCellItem,
} from '@mui/x-data-grid';
import RoleBasedGuard from '../../../auth/RoleBasedGuard';
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
import InfoIcon from '@mui/icons-material/Info';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { isFuture } from "date-fns";
import moment from 'moment';
import dayjs from "dayjs";
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock_
import { _levelList } from '../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import { getAllMenu2, createMenu, updateMenu, deleteMenu, postDocument } from '../../../dataProvider/agent';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFDatePicker, RHFUploadMultiFile } from '../../../components/hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSelector } from 'react-redux';
import { dispatch } from 'src/redux/store';
import { MultiFilePreview, Upload } from '../../../components/upload';
import {
    createDocumentInitialRedux,
    createFolderRedux,
    createStoreFolderRedux,
    getFolderRedux,
    getFolderSavetoDocToMyFolderRedux, getStoreFolderRedux,
} from '/src/redux/slices/folder';
import { postFile, getPeriodActive } from '../../../dataProvider/agent';
// ----------------------------------------------------------------------

function TextCode() {
    var result = 'VIC_' + dayjs(new Date()).format('YYYYMMDDHHmmss') + "_";

    var alphabet = 'abcdefghijklmnopqrstuvwxyz';
    var num = '0123456789';

    for (var index = 0; index < 9; index++) {
        if (Math.floor(Math.random() * 2) === 0) {
            result += alphabet.charAt(Math.floor(Math.random() * alphabet.length)).toUpperCase();
        } else {
            result += num.charAt(Math.floor(Math.random() * num.length));
        }
    }

    return result;
}

// ----------------------------------------------------------------------

createNewDoc.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function createNewDoc() {
    const router = useRouter();
    const { newDocument } = useSelector((state) => state.folder);
    const { user } = useAuthContext();
    const { programs } = newDocument.init;
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false); //Open Dialog
    const [files, setFiles] = useState([]);
    const [reRender, setReRender] = useState([]);
    const [typeDocuments, setTypeDocuments] = useState(user.subjects[0].typeDocuments);
    const [subjectId, setSubjectId] = useState(0);
    const [typeDocumentId, setTypeDocumentId] = useState(0);
    const [programId, setProgramId] = useState(0);
    const [contentText, setContentText] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [fromdate, setFromdate] = useState(Date);
    const [todate, setTodate] = useState(Date);

    const [refreshData, setRefreshData] = useState({});
    //call query
    const {
        query: { folderid, foldername },
    } = router;

    const pros = {
        folderid: folderid,
        foldername: foldername
    }

    const methods = useForm({
        defaultValues: {
            description: '',
            programId: _.get(programs, '0') ? _.get(programs, '0').id : '',
            subjectId: _.get(user, 'subjects.0') ? _.get(user, 'subjects.0').id : '',
            typeDocumentId: _.get(user, `subjects.0.typeDocuments.0`) ? _.get(user, `subjects.0.typeDocuments.0`).id : '',
            fromdate: fromdate,
            todate: todate
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

    const values = watch();

    useEffect(() => {
        if (programs.length == 0) {
            dispatch(createDocumentInitialRedux());
        } else {
            setProgramId(programs[0].id);
        }
    }, [dispatch]);

    const handleDrop = useCallback(
        async (acceptedFiles) => {
            try {
                //formData.append('File', acceptedFiles[0]);
                //const response = await postFile(formData);
                //setValue('TypeFile', response.data.contentType);
                //setValue('urlDocument', response.data.fileName);
                //setValue('size', response.data.size);
                const newFiles = acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                );
                setFiles([...files, ...newFiles]);
                setValue('files', [...files, ...newFiles]);
            } catch (error) {
                console.error('handleDrop', error);
            }
        },
        [setValue],
        [files]
    );

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = async ({ items }) => {
        if (files.length == 0) {
            setContentText('Bạn hãy chọn file tài liệu trước khi Đăng tải!!!');
            setOpen(true);
        } else {

            if (typeDocumentId == 0) {
                typeDocumentId = typeDocuments[0].id;
            }
            if (subjectId == 0) {
                subjectId = user.subjects[0].id;
            }
            if (programId == 0) {
                programId = programs[0].id;
            }
            for (let index = files.length - 1; index >= 0; --index) {
                const file = files[index];
                const formData = new FormData();
                formData.append('File', file);
                console.log('formData', formData);
                //upload data
                const response = await postFile(formData);
                if (response.status !== 200) {
                    enqueueSnackbar(`Upload tài liệu thất bại`, { variant: 'error' });
                    continue;
                }
                console.log('response', response);

                const TypeFile = response.data.contentType;
                const urlDocument = response.data.fileName;
                const size = response.data.size;
                const name = response.data.fileNameNoExt;
                const code = TextCode();
                console.log('Code:', code);
                const item = {
                    id: 0,
                    typeDocumentId: typeDocumentId,
                    subjectId: subjectId,
                    programId: programId,
                    code: TextCode(),
                    name: name,
                    link: link,
                    description: description,
                    size: size,
                    typeFile: TypeFile,
                    urlDocument: urlDocument,
                    timeOpen: dayjs(values.fromdate, 'YYYY-MM-DD'),
                    timeClose: dayjs(values.todate, 'YYYY-MM-DD'),
                    viewNumber: 0,
                    downloadNumber: 0,
                    status: 0,
                    folderId: parseInt(folderid)
                };
                const reponseDoc = await postDocument(item);
                if (reponseDoc.status < 400) {
                    console.log('upload tài liệu thanh cong', reponseDoc.data.title);
                    setTimeout(() => {
                        enqueueSnackbar('Bạn đã thêm ' + name + ' Tài liệu thành công!!!');
                    }, "2000")
                } else {
                    console.log('Lỗi upload tài liệu', reponseDoc.data.title);
                };
            }
            setContentText('Bạn đã thêm ' + files.length + '  Tài liệu thành công!!!');
            setOpen(true);
            setTimeout(() => {
                router.push(PATH_DASHBOARD.processDoc.list);
            }, "1000");

        }
        console.log('onSubmit', items);
    };

    const handleRemove = (file) => {
        const filteredItems = values.files?.filter((_file) => _file !== file); 
        setValue('files', filteredItems);
        setFiles(filteredItems);
    };
    const handleRemoveAll = () => {
        setValue('files', []);
    };
    const handlerSubjectChange = (event, index) => {
        var index = event.nativeEvent.target.selectedIndex;
        setTypeDocuments(user.subjects[index].typeDocuments);
        setSubjectId(parseInt(event.target.value));
        setValue(event.target.name, event.target.value);
        setValue(
            `typeDocumentId`,
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
    };
    const handlerProgramChange = (event, index) => {
        setProgramId(parseInt(event.target.value));
        setValue(event.target.name, event.target.value);
        setReRender({ [event.target.name]: event.target.value });
    };
    const handlerTypeDocIdChange = (event, index) => {
        setTypeDocumentId(parseInt(event.target.value));
        setValue(event.target.name, event.target.value);
        setReRender({ [event.target.name]: event.target.value });
    };

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>
            <Container maxWidth={'xl'}>
                <CustomBreadcrumbs
                    heading="Menu hệ thống"
                    links={[
                        { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                        { name: 'Xử lý Tài liệu học liệu', href: PATH_DASHBOARD.processDoc.root },
                        { name: 'Thêm mới tài liệu' },
                    ]}
                />
                <Container maxWidth={'xl'}>
                    <strong style={{
                        color: 'blue',
                        fontSize: 18
                    }}>Bạn đang thêm Tài liệu cho thư mục: {pros.foldername} &nbsp;
                    </strong>
                    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5}>
                                <Card sx={{ p: 3 }}>
                                    <Stack spacing={3}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Ngày bắt đầu</span>
                                            <Controller
                                                control={control}
                                                name="fromdate"
                                                render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                                                    <DatePicker
                                                        {...field}
                                                        label="Ngày bắt đầu"
                                                        renderInput={(inputProps) => (
                                                            <TextField
                                                                {...inputProps}
                                                                onBlur={onBlur}
                                                                name={fromdate}
                                                                error={!!fieldState.error}
                                                                helperText={fieldState.error?.message}
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Ngày kết thúc</span>
                                            <Controller
                                                control={control}
                                                name="todate"
                                                rules={{
                                                    validate: {
                                                        min: (date) => isFuture(date) || "Please, enter a future date"
                                                    }
                                                }}
                                                render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                                                    <DatePicker
                                                        {...field}
                                                        label="Ngày kết thúc"
                                                        renderInput={(inputProps) => (
                                                            <TextField
                                                                {...inputProps}
                                                                onBlur={onBlur}
                                                                name={todate}
                                                                error={!!fieldState.error}
                                                                helperText={fieldState.error?.message}
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Chương Trình</span>
                                            <RHFSelect name="programId" placeholder="Chương trình" onChange={handlerProgramChange}>
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
                                                onChange={handlerSubjectChange}
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
                                            <RHFSelect name="typeDocumentId" placeholder="Loại tài liệu" onChange={handlerTypeDocIdChange}>
                                                {typeDocuments.map((option, index) => (
                                                    <option key={index} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </RHFSelect>
                                        </div>
                                    </Stack>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Card sx={{ p: 3 }}>
                                    <Stack spacing={3}>
                                        <RHFTextField name={link} label="Link tài liệu" multiline rows={2} onChange={(event) => setLink(event.target.value)} />
                                        <RHFTextField name={description} label="Mô tả" multiline rows={3} onChange={(event) => setDescription(event.target.value)} />
                                        <Stack spacing={1} direction="row" flexWrap="wrap">
                                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                                Tập tin
                                            </Typography>
                                            <Upload name="file" multiple files={files} onDrop={handleDrop} onRemove={(file) => handleRemove(file)} />
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
                </Container>
            </Container>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Thông báo"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {contentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
