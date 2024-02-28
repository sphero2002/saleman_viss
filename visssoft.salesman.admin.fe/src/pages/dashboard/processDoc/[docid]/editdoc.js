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
import RoleBasedGuard from '../../../../auth/RoleBasedGuard';
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
    Typography, Grid, Stack, TextField,
    MenuItem
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
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock_
import { _levelList } from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import ConfirmDialog from '../../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
// sections
import { getAllMenu2, createMenu, updateMenu, updateDocument, postDocument } from '../../../../dataProvider/agent';
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFDatePicker, RHFUploadMultiFile } from '../../../../components/hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSelector } from 'react-redux';
import { dispatch } from 'src/redux/store';
import { MultiFilePreview, Upload } from '../../../../components/upload';
import { getOneDocumentRedux } from '/src/redux/slices/document';
import {
    createDocumentInitialRedux,
    createFolderRedux,
    createStoreFolderRedux,
    getFolderRedux,
    getFolderSavetoDocToMyFolderRedux, getStoreFolderRedux,
} from '/src/redux/slices/folder';
import { postFile, getPeriodActive } from '../../../../dataProvider/agent';
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

editdoc.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function editdoc() {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { getOne } = useSelector((state) => state.document);
    const hasShared = getOne && !!getOne.listShare.length;
    console.log('getOne', getOne);
    const [doc, setDoc] = useState(JSON.parse(window.localStorage.getItem('editdocs')));
    console.log('docs', doc);

    const { newDocument } = useSelector((state) => state.folder);
    console.log('newDocument', newDocument);
    const { user } = useAuthContext();
    const { programs } = newDocument.init;
    console.log('programs', programs);

    const [open, setOpen] = useState(false); //Open Dialog
    const [files, setFiles] = useState([]);
    const [filename, setFilename] = useState('');
    const [typeDocuments, setTypeDocuments] = useState(user.subjects[0].typeDocuments);
    const [subjects, setSubjects] = useState(user.subjects);
    console.log('typeDocuments', doc);

    const [subjectId, setSubjectId] = useState(doc.subjectID);
    const [typeDocumentId, setTypeDocumentId] = useState(doc.typeDocumentID);
    const [programId, setProgramId] = useState(doc.programID);

    const [contentText, setContentText] = useState('');
    const [description, setDescription] = useState(doc.description);
    const [docname, setDocname] = useState(doc.name);
    const [link, setLink] = useState(doc.link);

    const [fromdate, setFromdate] = useState(new Date(doc.timeOpen));
    const [todate, setTodate] = useState(new Date(doc.timeClose));

    const [refreshData, setRefreshData] = useState({});
    //call query
    const {
        query: { folderid, docid, foldername },
    } = router;

    const pros = {
        folderid: folderid,
        docid: docid,
        foldername: foldername
    }

    useEffect(() => {
        if (programs.length == 0) {
            dispatch(createDocumentInitialRedux());
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
                console.log('files', newFiles[0].path);
                setFilename(newFiles[0].path);
            } catch (error) {
                console.error('handleDrop', error);
            }
        },
        [files]
    );

    const handleClose = async () => {
        setOpen(false);
        await dispatch(getOneDocumentRedux(docid));
        router.push(PATH_DASHBOARD.processDoc.docdetail(docid));
    };

    const UpdateData = async () => {


        if (typeDocumentId == 0) {
            typeDocumentId = typeDocuments[0].id;
        }
        if (subjectId == 0) {
            subjectId = user.subjects[0].id;
        }
        if (programId == 0) {
            programId = programs[0].id;
        }
        var index = 0;
        const TypeFile = doc.typeFile;
        const urlDocument = doc.urlDocument;
        const size = doc.size;
        const name = doc.name;

        if (files.leng > 0) {
            const file = files[index];
            const formData = new FormData();
            formData.append('File', file);
            console.log('formData', formData);
            //upload data
            const response = await postFile(formData);
            if (response.status !== 200) {
                enqueueSnackbar(`Upload tài liệu thất bại`, { variant: 'error' });
                return;
            }
            console.log('response', response);

            TypeFile = response.data.contentType;
            urlDocument = response.data.fileName;
            size = response.data.size;
            name = response.data.fileNameNoExt;
        }
        const item = {
            id: 0,
            typeDocumentId: typeDocumentId,
            subjectId: subjectId,
            programId: programId,
            code: doc.code,
            name: name,
            link: link,
            description: description,
            size: size,
            typeFile: TypeFile,
            urlDocument: urlDocument,
            timeOpen: dayjs(fromdate, 'YYYY-MM-DD'),
            timeClose: dayjs(todate, 'YYYY-MM-DD'),
            viewNumber: 0,
            downloadNumber: 0,
            status: 0,
            folderId: parseInt(folderid)
        };
        const reponseDoc = await updateDocument(docid, item);
        try {
            if (reponseDoc.data.errorCode == 200) {
                setContentText('Bạn đã cập nhật Tài liệu ' + name + ' thành công!!!');
                setOpen(true);
            } else {
                setContentText('Lỗi upload tài liệu ' + reponseDoc.data.message + '!');
                setOpen(true);
            }
        } catch (error) {
            //const { request, ...errorObject } = response; // take everything but 'request' 
            console.log('response', error);
            setContentText('Lỗi upload tài liệu ' + reponseDoc.response.data + '!');
            setOpen(true);
        }
    };

    const handleRemove = (file) => {
        const filteredItems = files.files?.filter((_file) => _file !== file);
        setFiles(filteredItems);
    };
    const handleRemoveAll = () => {
        setFiles('files', []);
    };
    const handlerSubjectChange = (event) => {
        const value = event.target.value;
        console.log('subjects', subjects);
        const index = subjects.findIndex((option) => option.id === Number.parseInt(value));

        console.log('index', index);
        console.log('value', value);

        setSubjectId(parseInt(event.target.value));
        setTypeDocuments(subjects[index].typeDocuments);
        setTypeDocumentId(subjects[index].typeDocuments[0].id);
    };
    const handlerProgramChange = (event, index) => {
        setProgramId(parseInt(event.target.value));
    };
    const handlerTypeDocIdChange = (event, index) => {
        setTypeDocumentId(parseInt(event.target.value));
    };
    const redirectToOtherPage = useCallback(() => {
        router.push(PATH_DASHBOARD.processDoc.list);
    }, []);

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
                        { name: 'Danh sách tài liệu', href: PATH_DASHBOARD.processDoc.root },
                        { name: 'Chỉnh sửa tài liệu' },
                    ]}
                />
                <Container maxWidth={'xl'}>
                    <strong style={{
                        color: 'blue',
                        fontSize: 18
                    }}>Bạn đang chỉnh sửa thông tin Tài liệu "{docname}" của Thư mục "{pros.foldername}" &nbsp;
                    </strong>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <Card sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Ngày bắt đầu</span>
                                        <DatePicker
                                            label="Ngày bắt đầu"
                                            name={fromdate}
                                            value={fromdate}
                                            onChange={(newValue) => setFromdate(newValue)}
                                            renderInput={(inputProps) => (
                                                <TextField
                                                    {...inputProps}
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Ngày kết thúc</span>
                                        <DatePicker
                                            label="Ngày kết thúc"
                                            name={todate}
                                            onChange={(newValue) => setTodate(newValue)}
                                            value={todate}
                                            renderInput={(inputProps) => (
                                                <TextField
                                                    {...inputProps}
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Chương Trình</span>
                                        <TextField
                                            id="programId"
                                            select
                                            placeholder="Chương trình"
                                            label="Chương trình"
                                            value={programId}
                                            onChange={handlerProgramChange}
                                            helperText="Bạn hãy chọn Chương trình"
                                            fullWidth
                                        >
                                            {!_.isEmpty(programs) &&
                                                programs.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                        </TextField>

                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Môn học</span>
                                        <TextField
                                            id="subjectId"
                                            select
                                            placeholder="Môn học"
                                            value={subjectId}
                                            onChange={handlerSubjectChange}
                                            helperText="Bạn hãy chọn Môn học"
                                            fullWidth
                                        >
                                            {_.get(user, `subjects`) &&
                                                user.subjects.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                        </TextField>

                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span style={{ fontSize: '0.875rem', fontWeight: 400, width: '200px' }}>Loại</span>
                                        <TextField
                                            id="typeDocumentId"
                                            select
                                            placeholder="Loại tài liệu"
                                            value={typeDocumentId}
                                            onChange={handlerTypeDocIdChange}
                                            helperText="Bạn hãy chọn Loại tài liệu"
                                            fullWidth
                                        >
                                            {typeDocuments.map((option, index) => (
                                                <MenuItem key={index} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Card sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    <TextField name={link} value={link} label="Link tài liệu" multiline rows={2} onChange={(event) => setLink(event.target.value)} />
                                    <TextField name={description} value={description} label="Mô tả" multiline rows={3} onChange={(event) => setDescription(event.target.value)} />
                                    <Stack spacing={1} direction="row" flexWrap="wrap">
                                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                            Tập tin
                                        </Typography>
                                        <Upload name="file" files={files} onDrop={handleDrop} onRemove={(file) => handleRemove(file)} />
                                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                            Tài liệu để upload:  <strong style={{
                                                color: 'blue',
                                                fontSize: 18
                                            }}>{filename}</strong>
                                        </Typography>
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
                                onClick={UpdateData}
                            >
                                Chỉnh sửa tài liệu
                            </LoadingButton>
                            <Button 
                                variant="soft"
                                color="error"
                                size="large"
                                startIcon={<Iconify icon="eva:arrow-back-fill" />}
                                onClick={redirectToOtherPage}
                            >
                                Thoát
                            </Button>
                        </Stack>
                    </Stack>
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
