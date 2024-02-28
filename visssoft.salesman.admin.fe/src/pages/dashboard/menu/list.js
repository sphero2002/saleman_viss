import { paramCase } from 'change-case';
import { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui 
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
    TableContainer, Box, Pagination,
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
import { getAllMenu2, createMenu, updateMenu, deleteMenu } from '../../../dataProvider/agent';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

MenuListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function MenuListPage() {
    const router = useRouter();
    const [open, setOpen] = useState(false); //Open Dialog
    const idRef = useRef();
    const parentIdRef = useRef();
    const subheaderRef = useRef();
    const titleRef = useRef();
    const pathRef = useRef();
    const iconRef = useRef();

    let initialFormData = { id: null, parentId: null, subheader: "", title: "", path: "", icon: "" };
    const [refreshData, setRefreshData] = useState({});
    const [id, setId] = useState(0);
    const [parentId, setParentId] = useState(0);
    const [subheader, setSubheader] = useState("");
    const [title, setTitle] = useState("");
    const [path, setPath] = useState("");
    const [icon, setIcon] = useState("");
    const [action, setAction] = useState("");

    const [currentMenu, setCurrentMenu] = useState(initialFormData);
    const [text, setText] = useState('');

    const handleClose = () => {
        setOpen(false);
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
        setParentId(editedRow.parentId);
        setSubheader(editedRow.subheader);
        setTitle(editedRow.title);
        setPath(editedRow.path);
        setIcon(editedRow.icon);
        setId(id);
        setText('Lưu');
        setOpen(true);
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
        try {
            const res = await deleteMenu(id);
            if (res.status < 400) {
                fetchData();
                enqueueSnackbar('Cập nhật Menu thành công!');
                push(PATH_DASHBOARD.menu.list);
            } else {
                enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Đã có lỗi xảy ra !', { variant: 'error' });
            console.log(error);
        }
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
                const res = await updateMenu(id, {
                    parentId: parentIdRef.current.value,
                    subheader: subheaderRef.current.value,
                    title: titleRef.current.value,
                    path: pathRef.current.value,
                    icon: iconRef.current.value,
                });
                if (res.status < 400) {
                    setAction("OK");
                    enqueueSnackbar('Cập nhật Menu thành công!');
                    push(PATH_DASHBOARD.menu.list);
                } else {
                    enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
                }
            } else {
                const res = await createMenu({
                    parentId: parentIdRef.current.value,
                    subheader: subheaderRef.current.value,
                    title: titleRef.current.value,
                    path: pathRef.current.value,
                    icon: iconRef.current.value,
                });
                if (res.status < 400) {
                    setAction("OK");
                    enqueueSnackbar('Thêm mới Menu thành công!');
                    push(PATH_DASHBOARD.menu.list);
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
            field: 'parentId',
            headerName: 'ID Cha',
            align: 'left'
        },
        {
            field: 'subheader',
            headerName: 'Tiêu đề cha',
            width: 250,
        },
        {
            field: 'title',
            headerName: 'Tiêu đề con',
            width: 250,
        },
        {
            field: 'path',
            headerName: 'Đường dẫn của Trang',
            width: 250,
        },
        {
            field: 'icon',
            headerName: 'icon',
            width: 150,
            flex: 1
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
        const response = await getAllMenu2(`pageIndex=${pageState.page}&pageSize=${pageState.pageSize}&searchByName=${pageState.searchByName}`)
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
            setParentId(0);
            setSubheader('');
            setTitle('');
            setPath('');
            setIcon('');
            setId(0);
            setText('Thêm mới');
            setOpen(true);
        };

        return (
            <GridToolbarContainer>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClick}>
                    Thêm mới Menu
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
                    heading="Menu hệ thống"
                    links={[
                        { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                        { name: 'Menu', href: PATH_DASHBOARD.menu.root },
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


            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thông tin Menu</DialogTitle>
                <form
                    noValidate
                // onSubmit={() => handleSubmit(id)}
                >
                    <DialogContent>
                        <DialogContentText>
                            Nhập thông tin Menu cần chỉnh sửa.
                        </DialogContentText>
                        <TextField
                            value={parentId}
                            inputRef={parentIdRef}
                            onChange={(event) => setParentId(event.target.value)}
                            autoFocus
                            margin="dense"
                            id="parentId"
                            label="ID Cha"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            value={subheader}
                            inputRef={subheaderRef}
                            onChange={(event) => setSubheader(event.target.value)}
                            autoFocus
                            margin="dense"
                            id="subheader"
                            label="Tiêu đề cha"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            value={title}
                            inputRef={titleRef}
                            onChange={(event) => setTitle(event.target.value)}
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Tiêu đề con"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            value={path}
                            inputRef={pathRef}
                            onChange={(event) => setPath(event.target.value)}
                            autoFocus
                            margin="dense"
                            id="path"
                            label="Đường dẫn của Trang"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            value={icon}
                            inputRef={iconRef}
                            onChange={(event) => setIcon(event.target.value)}
                            autoFocus
                            margin="dense"
                            id="icon"
                            label="Biểu tượng"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button onClick={handleSave}>{text}</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
