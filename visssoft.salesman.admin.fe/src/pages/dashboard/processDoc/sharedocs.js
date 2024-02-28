import { paramCase } from 'change-case';
import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
// @mui 
import dayjs from "dayjs";
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {
    DataGrid, GridColDef, GridRowModes, GridToolbarContainer, GridActionsCellItem,
} from '@mui/x-data-grid';
import RoleBasedGuard from '../../../auth/RoleBasedGuard';
import { JsonObjectContext } from '../../../context/JsonObjectContext';
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
    TableContainer, Box, Pagination, Select, MenuItem, Typography, Stack
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
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
import { getClassesRedux } from 'src/redux/slices/class';
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
import { UserTableToolbar, UserTableShare } from '../../../sections/@dashboard/user/list';
import { getALlRoles, getAllUsers, addShareDoc } from '../../../dataProvider/agent';
import { useSnackbar } from '../../../components/snackbar';
import { useAuthContext } from 'src/auth/useAuthContext';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from '../../../components/table';
import { dispatch } from 'src/redux/store';
import {
    createData
} from '/src/redux/slices/data';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Họ Tên', align: 'left' },
    { id: 'email', label: 'Email', align: 'left' },
    { id: 'role', label: 'Vai trò', align: 'left' },
    { id: 'status', label: 'Trạng thái', align: 'left' }
];



// ----------------------------------------------------------------------

ShareDocs.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

const datagridSx = {
    '& div[data-rowIndex][role="row"]': {
        color: "blue",
        fontSize: 14,
    },
    "& .MuiDataGrid-columnHeaders": {
        fontSize: 16
    }
};

export default function ShareDocs() {
    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable();

    const data = useSelector(state => state.data);

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { pagging, classes } = useSelector((state) => state.class);
    console.log('Classes', classes);
    const { user } = useAuthContext();
    console.log('Users:', user);
    const [subjects, setSubjects] = useState([]);
    const [value, setValue] = React.useState('1');
    const [permissaction, setPermissAction] = React.useState(0);
    const [docs, setDocs] = useState(JSON.parse(window.localStorage.getItem('sharedocs')));
    console.log('docs', docs);
    const denseHeight = dense ? 52 : 72;
    const [pagingClass, setPagingClass] = React.useState({
        pageIndex: 1,
        pageSize: 20,
        searchByName: '',
        gradeId: '',
        programId: '',
    });
    const [role, setSelectedRole] = useState('all');
    const [filter, setFilter] = useState({
        pageIndex: 1,
        pageSize: 20,
        searchByEmail: '',
        roleId: '',
    });

    const [filterByEmail, setFilterByEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [userRole, setUserRole] = useState([]);
    const [filterStatus, setFilterStatus] = useState(-1);
    const [listUsers, setListUsers] = useState([]);
    const [paging, setPaging] = useState();
    const getLengthByStatus = (status) => listUsers?.filter((user) => user.enable === status).length;
    const { setJsonObject } = useContext(JsonObjectContext);

    useEffect(() => {
        dispatch(getClassesRedux(pagingClass));
        console.log('Classes', classes);
        setSubjects(user.subjects);
        console.log('subjects:', user.subjects);
    }, []);

    const columns = [
        {
            width: 300,
            field: 'abc',
            headerName: "Danh sách học liệu để Chia sẻ",
            sortable: false,
            renderCell: ({ row }) =>
                <div style={{ fontSize: 13 }}>
                    <Typography style={{ fontSize: 14, color: "blue" }}> Tên tài liệu: {row.name}</Typography>
                    <Typography style={{ fontSize: 14, color: "blue" }}> Môn: {row.subjectname}</Typography>
                    <Typography style={{ fontSize: 12 }}>File: {row.urlDocument}</Typography>
                    <Typography style={{ fontSize: 12 }}> Loại file: {row.typeFile}</Typography>
                    <Typography style={{ fontSize: 12 }}> Size: {row.size}</Typography>
                </div>

        }
    ];

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const handleChangeRoles = (event) => {
        console.log('event.target.value', event.target.value);
        setFilter({ ...filter, roleId: event.target.value === 'all' ? '' : event.target.value });
        setSelectedRole(event.target.value + '');
    };
    const handleChangeFilterByEmail = useCallback(
        (event) => {
            setFilter({ ...filter, searchByEmail: event.target.value });
        },
        [filter]
    );
    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };
    const handleFilterRole = (event) => {
        setPage(0);
        setFilterRole(event.target.value);
    };
    const handleResetFilter = () => {
        setSelectedRole('all');
        setFilterByEmail('');
        setIsSearching(false);
    };
    const handlePageChange = useCallback(
        (event, pageIndex) => {
            setFilter({ ...filter, pageIndex: pageIndex });
        },
        [filter]
    );
    async function fetchRoles() {
        const res = await getALlRoles({ pageIndex: 1, pageSize: 10 });
        if (res.status < 400) {
            const transformData = res.data.data.map((tag) => {
                return {
                    label: tag.name,
                    id: tag.id,
                };
            });

            setUserRole(transformData);
            console.log('userRole', userRole);
        } else {
            return error;
        }
    }
    async function fetchUsers() {
        const res = await getAllUsers(filter);
        if (res.status < 400) {
            setPaging(JSON.parse(res.headers['x-pagination']));
            setListUsers(res.data.data);
            console.log('listUsers', listUsers);
        } else {
            console.log(res.message);
        }
    }
    useEffect(() => {
        fetchUsers();
    }, [filter]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleSendInvite = (selectedRows) => {
        console.log('ShareDocs', selectedRows);
        const userRows = listUsers.filter((row) => selectedRows.includes(row.id));
        console.log('userRows', userRows);
        var sharedocs = [];
        var myObject = new Array();
        userRows.forEach(function (row) {
            console.log('row', row);
            var user = {};
            user.id = row.id;
            user.email = row.email;
            user.firstName = row.firstName;
            user.lastName = row.lastName;
            user.gender = row.gender;
            user.birthDate = row.birthDate;
            user.address = row.address;
            user.phone = row.phone;
            user.isTeacher = row.isTeacher;
            user.enable = row.enable;
            user.createBy = row.createBy;
            user.updateBy = row.updateBy;
            user.createDate = row.createDate;
            user.updateDate = row.updateDate;
            user.isDeleted = 0;
            console.log('user', user);
            myObject.push({
                "permission": 0,
                "user": user
            });
            user = null;
        });
        sharedocs = myObject;
        console.log('myObject:', myObject);
        console.log('sharedocs:', sharedocs);
        console.log(JSON.stringify(sharedocs));

        var docsusers = [];
        docs.forEach(async function (doc) {
            var docid = doc.id;
            var name = doc.name;
            docsusers.push({
                "docid": docid,
                "docname": name,
                "permissaction": permissaction,
                "users": sharedocs
            });
            //const response = await addShareDoc(docid, JSON.stringify(sharedocs));
            //console.log("response", response);
        });
        window.localStorage.setItem('shareddocsinfo', JSON.stringify(docsusers));
        setJsonObject(docsusers);
        dispatch(createData(docsusers));
        router.push({
            pathname: PATH_DASHBOARD.processDoc.shareddocinfo
        });
        //enqueueSnackbar("Bạn đã chia sẻ " + sharedocs.length + " tài liệu thành công");
    };
    const handlePermissActionChange = (event) => {
        setPermissAction(event.target.value);
    };
    return (
        <>

            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>
            <Container maxWidth={'xl'}>
                <CustomBreadcrumbs
                    heading="Xử lý Tài liệu học liệu"
                    links={[
                        { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                        { name: 'Xử lý Tài liệu học liệu', href: PATH_DASHBOARD.processDoc.list },
                        { name: 'Chia sẻ tài liệu' },
                    ]}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} >
                        <Grid item xs={4} style={{ borderRight: "2px solid gray" }}>
                            <Item>
                                <div style={{ height: '350px', width: '100%', textAlign: 'left' }} >
                                    <DataGrid
                                        rows={docs}
                                        columns={columns}
                                        pageSize={10}
                                        rowsPerPageOptions={[50]}
                                        disableSelectionOnClick
                                        hideFooter
                                        getRowHeight={() => 'auto'}
                                    />
                                </div>
                            </Item>
                        </Grid>
                        <Grid item xs={8}>
                            <Card>
                                <Divider />
                                <FormControl>
                                    <FormLabel id="action-row-radio-buttons-group-label"><Typography style={{ textAlign: 'left', fontSize: 13, fontWeight: 'bold' }}> Người dùng được quyền:</Typography>  </FormLabel>
                                    <RadioGroup
                                        row
                                        value={permissaction}
                                        onChange={handlePermissActionChange}
                                        aria-labelledby="action-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel value="0" control={<Radio />} label="Chỉ xem tài liệu" />
                                        <FormControlLabel value="1" control={<Radio />} label="Xem/Tải tài liệu" /> 
                                    </RadioGroup>
                                </FormControl>

                                <Divider />
                                <UserTableToolbar
                                    onChangeRoles={handleChangeRoles}
                                    selectedRole={role}
                                    onChangeFilterByEmail={handleChangeFilterByEmail}
                                    filterByEmail={filterByEmail}
                                    isFiltered={isSearching}
                                    filterName={filterName}
                                    filterRole={filterRole}
                                    optionsRole={userRole}
                                    onFilterName={handleFilterName}
                                    onFilterRole={handleFilterRole}
                                    onResetFilter={handleResetFilter}
                                />

                                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                                    <TableSelectedAction
                                        dense={dense}
                                        numSelected={selected.length}
                                        rowCount={selected.length}
                                        onSelectAllRows={(checked) =>
                                            onSelectAllRows(
                                                checked,
                                                listUsers.map((row) => row.id)
                                            )
                                        }
                                        action={
                                            <Tooltip title="Chia sẻ">
                                                <IconButton color="primary" onClick={() => {
                                                    handleSendInvite(selected);
                                                }} >
                                                    <Iconify icon="eva:share-fill" />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    />

                                    <Scrollbar>
                                        <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                                            <TableHeadCustom
                                                order={order}
                                                orderBy={orderBy}
                                                headLabel={TABLE_HEAD}
                                                rowCount={listUsers?.length}
                                                numSelected={selected.length}
                                                onSort={onSort}
                                                onSelectAllRows={(checked) =>
                                                    onSelectAllRows(
                                                        checked,
                                                        listUsers.map((row) => row.id)
                                                    )
                                                }
                                            />

                                            <TableBody>
                                                {/* listUsers */}
                                                {listUsers.map((user) => (
                                                    <UserTableShare
                                                        key={user.id}
                                                        data={user}
                                                        selected={selected.includes(user.id)}
                                                        onSelectRow={() => onSelectRow(user.id)}
                                                    />
                                                ))}

                                                <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, listUsers?.length)} />
                                            </TableBody>
                                        </Table>
                                    </Scrollbar>
                                </TableContainer>

                                <Box p={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div></div>
                                    <Pagination
                                        size="small"
                                        count={paging?.TotalPages}
                                        rowsperpage={paging?.PageSize}
                                        onChange={handlePageChange}
                                        color="primary"
                                    />
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}


