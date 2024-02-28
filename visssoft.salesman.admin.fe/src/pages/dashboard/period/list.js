import { paramCase } from 'change-case';
import { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui 
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers';
import {
    DataGrid, GridColDef, GridRowModes, GridToolbarContainer, GridActionsCellItem,
} from '@mui/x-data-grid';
import RoleBasedGuard from '../../../auth/RoleBasedGuard';
import {
    Tab,
    Tabs,
    Card,
    Table,
    Button,
    Tooltip,
    Divider,
    TableBody,
    Container,
    IconButton,
    TableContainer, Box, Pagination, Select, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
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
import { getPeriodById, getAllPeriod, createPeriod, updatePeriod, deletePeriod } from '../../../dataProvider/agent';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

PeriodListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PeriodListPage() {
    const router = useRouter();
    const [open1, setOpen1] = useState(false); //Open Dialog
    const idRef = useRef();
    const fromdateRef = useRef();
    const todateRef = useRef();
    const descriptionRef = useRef();
    const statusRef = useRef();
    const [value, setValue] = useState([null, null]);

    let initialFormData = { id: null, fromdate: null, todate: null, description: "", status: 1 };

    const [refreshData, setRefreshData] = useState({});

    const [id, setId] = useState(0);
    const [fromdate, setfromdate] = useState(dayjs(new Date()));
    const [todate, settodate] = useState(dayjs(new Date()));
    const [description, setdescription] = useState("");
    const [status, setstatus] = useState(0);
    const [action, setAction] = useState("");

    const [currentPeriod, setCurrentPeriod] = useState(initialFormData);
    const [text, setText] = useState('');

    const handleClose1 = () => {
        setOpen1(false);
        if (action == "OK") {
            fetchData();
        }
    };
    const { enqueueSnackbar } = useSnackbar();
    const { themeStretch } = useSettingsContext();
    const { push } = useRouter();
    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = useState({});

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleEditClick = (id) => () => {
        const editedRow = rows.find((row) => row.id === id);
        setfromdate(editedRow.fromdate);
        settodate(editedRow.todate);
        setdescription(editedRow.description);
        setstatus(editedRow.status);
        setId(id);
        setText('Lưu');
        setOpen1(true);
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
        try {
            const res = await deletePeriod(id);
            if (res.status < 400) {
                fetchData();
                enqueueSnackbar('Xóa Đóng/Mở kỳ học liệu thành công!');
                push(PATH_DASHBOARD.period.list);
            } else {
                enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Đã có lỗi xảy ra !', { variant: 'error' });
            console.log(error);
        }
    };

    const handleChange = (event) => {
        setstatus(event.target.value);
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const handleSave = async () => {
        try {
            // return console.log('Form data', data);
            if (id != 0) {
                const res = await updatePeriod(id, {
                    id: 0,
                    fromdate: fromdate,
                    todate: todate,
                    description: descriptionRef.current.value,
                    status: status
                });
                if (res.status < 400) {
                    setAction("OK");
                    enqueueSnackbar('Cập nhật Đóng/Mở kỳ thành công!');
                    push(PATH_DASHBOARD.period.list);
                } else {
                    enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
                }
            } else {
                const res = await createPeriod({
                    id: 0,
                    fromdate: fromdate,
                    todate: todate,
                    description: descriptionRef.current.value,
                    status: status, 
                });
                if (res.status < 400) {
                    setAction("OK");
                    enqueueSnackbar('Thêm mới Đóng/Mở kỳ thành công!');
                    push(PATH_DASHBOARD.period.list);
                } else {
                    enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
                }
            }
        } catch (error) {
            enqueueSnackbar('Đã có lỗi xảy ra !', { variant: 'error' });
            console.log(error);
        }
        //setOpen(false);
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 60 },
        {
            field: 'fromdate',
            valueFormatter: params =>
                moment(params?.value).format("DD/MM/YYYY"),
            headerName: 'Từ ngày',
            width: 200,
            align: 'left'
        },
        {
            field: 'todate',
            valueFormatter: params =>
                moment(params?.value).format("DD/MM/YYYY"),
            headerName: 'Đến ngày',
            width: 200,
        },
        {
            field: 'description',
            headerName: 'Mô tả',
            width: 200,
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 150,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];
    const [pageState, setPageState] = useState({
        isLoading: false,
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        searchByName: ''
    })

    const fetchData = async () => {
        console.log('ON')
        setPageState(old => ({ ...old, isLoading: true }))
        const response = await getAllPeriod(`pageIndex=${pageState.page}&pageSize=${pageState.pageSize}`)
        const json = await response.data
        const paging = JSON.parse(response.headers['x-pagination'])
        setPageState(old => ({ ...old, isLoading: false, data: json.data, total: paging.TotalCount }))
        setRows(json.data);
    }
    useEffect(() => {
        fetchData()
    }, [pageState.page, pageState.pageSize])

    function EditToolbar(props) {
        const { setRows, setRowModesModel } = props;

        const handleClick = () => {
            setfromdate(dayjs(new Date()));
            settodate(dayjs(new Date()));
            setdescription('');
            setstatus(0);
            setText('Thêm mới');
            setId(0);
            setOpen1(true);
        };

        return (
            <GridToolbarContainer sx = {{ color: 'white' }} >
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClick} >
                    Thêm mới Đóng/Mở kỳ
                </Button>
            </GridToolbarContainer>
        );
    }

    EditToolbar.propTypes = {
        setRowModesModel: PropTypes.func.isRequired,
        setRows: PropTypes.func.isRequired,
    };

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>
            <Container maxWidth={'xl'}>
                <CustomBreadcrumbs
                    heading="Đóng/Mở kỳ học liệu"
                    links={[
                        { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                        { name: 'Đóng mở kỳ', href: PATH_DASHBOARD.period.root },
                        { name: 'Danh sách' },
                    ]}
                />
                <Container style={{ marginTop: 5, marginBottom: 5 }}>
                    <DataGrid
                        autoHeight
                        rows={pageState.data}
                        rowCount={pageState.total}
                        loading={pageState.isLoading}
                        rowsPerPageOptions={[10, 30, 50, 70, 100]}
                        pagination
                        page={pageState.page - 1}
                        pageSize={pageState.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                            setPageState(old => ({ ...old, page: newPage + 1 }))
                        }}
                        onPageSizeChange={(newPageSize) => setPageState(old => ({ ...old, pageSize: newPageSize }))}
                        columns={columns}
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStart={handleRowEditStart}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        components={{
                            Toolbar: EditToolbar,
                        }}
                        componentsProps={{
                            toolbar: { setRows, setRowModesModel },
                        }}
                    />
                </Container>
            </Container>


            <Dialog open={open1} onClose={handleClose1}>
                <DialogTitle>Thông tin Đóng/Mở kỳ</DialogTitle>
                <form
                    noValidate
                // onSubmit={() => handleSubmit(id)}
                >
                    <DialogContent>
                        <DialogContentText>
                            Nhập thông tin Đóng/Mở kỳ cần chỉnh sửa.
                        </DialogContentText>
                        <DatePicker
                            label="Từ ngày"
                            value={fromdate}
                            onChange={(newValue) => {
                                setfromdate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                            label="Đến ngày"
                            value={todate}
                            onChange={(newValue) => {
                                settodate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <TextField
                            value={description}
                            inputRef={descriptionRef}
                            onChange={(event) => setdescription(event.target.value)}
                            autoFocus
                            margin="dense"
                            id="description"
                            label="Mô tả"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <Select
                            value={status}
                            onChange={handleChange}
                            autoFocus
                            margin="dense"
                            id="status"
                            label="Đóng/Mở kỳ"
                            type="text"
                            fullWidth
                            variant="standard"
                        >
                            <MenuItem value={0}>Đóng</MenuItem>
                            <MenuItem value={1}>Mở</MenuItem>
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose1}>Hủy</Button>
                        <Button onClick={handleSave}>{text}</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
