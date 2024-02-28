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
import {
    DataGrid, GridColDef, GridRowModes, GridToolbarContainer, GridActionsCellItem,
} from '@mui/x-data-grid';
import RoleBasedGuard from '../../../../auth/RoleBasedGuard';
import { JsonObjectContext } from '../../../../context/JsonObjectContext';
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
    TableContainer, Box, Pagination, Select, MenuItem, Typography
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
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { getClassesRedux } from 'src/redux/slices/class';
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
import { UserTableToolbar, UserTableShare } from '../../../../sections/@dashboard/user/list';
import { getALlRoles, getAllUsers, addShareDoc, getUserById, updateClassMember } from '../../../../dataProvider/agent';
import { useSnackbar } from '../../../../components/snackbar';
import { useAuthContext } from 'src/auth/useAuthContext';
import { getAllUsersWithInfoRedux, getUsersRedux } from 'src/redux/slices/user';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from '../../../../components/table';
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

addmembers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------


export default function addmembers() {
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
    const {
        query: { class_id },
    } = useRouter();
    const { themeStretch } = useSettingsContext();

    const data = useSelector(state => state.data);

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const { user } = useAuthContext();
    console.log('Users:', user);

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
        dispatch(getAllUsersWithInfoRedux({ pageIndex: 1, pageSize: 20 }, 0));
    }, []);



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

    const handleUpdateMembers = (selectedRows) => {
        console.log('Members', selectedRows);

        const dataPayload = [];
        const userRows = listUsers.filter((row) => selectedRows.includes(row.id));

        userRows.forEach(async function (user) {
            console.log('user', user);
            // chuan bi
            const obj = {
                userId: 0,
                userRoleClass: {
                    roleId: 0,
                    subjectId: [],
                },
            };
            obj.userId = user.id;
            obj.userRoleClass.roleId = user.roles[0].id;
            const res = await getUserById(user.id);
            if (res.status < 400) {
                if (res.data.data.subjects != null) {
                    obj.userRoleClass.subjectId = res.data.data.subjects.map((data) => data.id);
                }
            } else {
                console.log(res.message);
            }

            dataPayload.push(obj);
        });

        console.log('dataPayload: ', dataPayload);
        setTimeout(async function () {
            const response = await updateClassMember(class_id, dataPayload);
            console.log('response data: ', response);
            if (response instanceof Error) {
                enqueueSnackbar(` ${response.response?.data.title}`, { variant: 'error' });
            } else {
                enqueueSnackbar(`Thêm người dùng thành công`, { variant: 'success' });
            }
        }, 2000);


        //sharedocs = myObject;
        //console.log('myObject:', myObject);
        //console.log('sharedocs:', sharedocs);
        //console.log(JSON.stringify(sharedocs));

        //var docsusers = [];
        //docs.forEach(async function (doc) {
        //    var docid = doc.id;
        //    var name = doc.name;
        //    docsusers.push({
        //        "docid": docid,
        //        "docname": name,
        //        "users": sharedocs
        //    });
        //    //const response = await addShareDoc(docid, JSON.stringify(sharedocs));
        //    //console.log("response", response);
        //});
        //window.localStorage.setItem('shareddocsinfo', JSON.stringify(docsusers));
        //setJsonObject(docsusers);
        //dispatch(createData(docsusers));
        //router.push({
        //    pathname: PATH_DASHBOARD.processDoc.shareddocinfo
        //});
        //enqueueSnackbar("Bạn đã chia sẻ " + sharedocs.length + " tài liệu thành công");
    };

    return (
        <>

            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>
            <Container maxWidth={'xl'}>
                <CustomBreadcrumbs
                    heading="Thêm thành viên vào lớp"
                    links={[
                        {
                            name: 'Trang chủ',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Chi tiết lớp học',
                            href: PATH_DASHBOARD.class.detail(class_id),
                        },
                        {
                            name: 'Thêm thành viên',
                        },
                    ]}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Card>
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
                                    <Tooltip title="Thêm thành viên">
                                        <IconButton color="primary" onClick={() => {
                                            handleUpdateMembers(selected);
                                        }} >
                                            <Iconify icon="eva:person-add-fill" size="large" />
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
                </Box>
            </Container>
        </>
    );
}


