import { paramCase } from 'change-case';
import { useEffect, useState, useCallback, useRef, useMemo, forwardRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui 
import {
    DataGrid, GridColDef, GridRowModes, GridToolbarContainer, GridActionsCellItem, GridSelectionModel
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
    TableContainer, Box, Pagination, Stack, AppBar, Toolbar, Badge
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ShareIcon from '@mui/icons-material/Share';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem, { treeItemClasses, useTreeItem } from '@mui/lab/TreeItem';
import SvgIcon from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ButtonGroup from '@mui/material/ButtonGroup';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import dayjs from "dayjs";
import MenuPopover from '../../../components/menu-popover';
import Iconify from '../../../components/iconify';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock_
import { _levelList } from '../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import { getCommonFiles, getFolderTree, deleteDocument } from '../../../dataProvider/agent';
import { FileFolderCard, FileNewFolderDialog, FilePanel } from '../../../sections/@dashboard/file';
import { useSnackbar } from '../../../components/snackbar';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import { dispatch } from 'src/redux/store';
import { getOneDocumentRedux } from '/src/redux/slices/document';
import {
    createDocumentInitialRedux,
    createFolderRedux,
    createStoreFolderRedux,
    getFolderRedux,
    getFolderSavetoDocToMyFolderRedux,
    deleteSubFolderInFolderRedux,
    deleteSubFolderInStoreFolderRedux,
    getStoreFolderRedux,
    updateSubFolderRedux,
    updateSubStoreFolderRedux
} from '/src/redux/slices/folder';
// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

ProcessDocPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

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

const useStyles = makeStyles(theme => ({
    root: {
        height: 500,
        flexGrow: 1,
        maxWidth: 300
    },
    container: {
        border: '4px solid green',
        display: 'inline-flex',
    },
    item: { borderRadius: '30px' },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));
const styles = () => ({
    selected: {
        '&:focus': {
            backgroundColor: 'red',
        },
    },
});
const CustomContent = forwardRef(function CustomContent(props, ref) {
    const {
        classes,
        className,
        label,
        nodeId,
        icon: iconProp,
        expansionIcon,
        displayIcon,
    } = props;

    const {
        disabled,
        expanded,
        selected,
        focused,
        handleExpansion,
        handleSelection,
        preventSelection,
    } = useTreeItem(nodeId);

    const icon = iconProp || expansionIcon || displayIcon;

    const handleMouseDown = (event) => {
        preventSelection(event);
    };

    const handleExpansionClick = (event) => {
        handleExpansion(event);
    };

    const handleSelectionClick = (event) => {
        handleSelection(event);
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={clsx(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled,
            })}
            onMouseDown={handleMouseDown}
            ref={ref}
        >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div onClick={handleExpansionClick} className={classes.iconContainer}>
                {icon}
            </div>
            <Typography
                onClick={handleSelectionClick}
                component="div"
                className={classes.label}
            >
                {label}
            </Typography>
        </div>
    );
});

CustomContent.propTypes = {
    /**
     * Override or extend the styles applied to the component.
     */
    classes: PropTypes.object.isRequired,
    /**
     * className applied to the root element.
     */
    className: PropTypes.string,
    /**
     * The icon to display next to the tree node's label. Either a parent or end icon.
     */
    displayIcon: PropTypes.node,
    /**
     * The icon to display next to the tree node's label. Either an expansion or collapse icon.
     */
    expansionIcon: PropTypes.node,
    /**
     * The icon to display next to the tree node's label.
     */
    icon: PropTypes.node,
    /**
     * The tree node label.
     */
    label: PropTypes.node,
    /**
     * The id of the node.
     */
    nodeId: PropTypes.string.isRequired,
};

const CustomTreeItem = (props) => (
    <TreeItem ContentComponent={CustomContent} {...props} />
);

export default function ProcessDocPage() {
    const router = useRouter();
    const [open, setOpen] = useState(false); //Open Dialog 
    const [data, setData] = useState({}); //Set Data Tree
    const [gridrows, setGridrows] = useState([]); //Set Data Grid
    const [selectedIndex, setSelectedIndex] = useState(1);

    const [selected, setSelected] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [openEditFolder, setOpenEditFolder] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const { themeStretch } = useSettingsContext();
    const { push } = useRouter();

    const [selectionModel, setSelectionModel] = useState([]);
    const [selectedrows, setSelectedRows] = useState([]);
    const [contentText, setContentText] = useState('');

    const [disabled, setDisabled] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [openPopover, setOpenPopover] = useState(null);

    const classes = useStyles();

    const [foldername, setFolderName] = useState("");
    const [folderid, setFolderID] = useState(null);
    const [openFormUploadDocument, setOpenFormUploadDocument] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const [openNewStoreFolder, setOpenNewStoreFolder] = useState(false);
    const [storeFolderName, setStoreFolderName] = useState('');

    const fetchGridData = async (id, name) => {
        console.log('ON fetchGridData', id)
        const response = await getCommonFiles(id);
        const json = await response.data;
        setGridrows(json.data);
        console.log(json.data);
        setFolderName(name);
        setFolderID(id);
    }

    const handleOpenFormUploadDocument = async () => {
        if (folderid == 0) {
            setContentText('Bạn chưa chọn Thư mục Học liệu!!!');
            setOpen(true);
        } else {
            await dispatch(createDocumentInitialRedux());
            router.push({
                pathname: PATH_DASHBOARD.processDoc.createNewDoc,
                query: {
                    folderid: folderid,
                    foldername: foldername
                }
            });
        }
    };

    const handleOpenFormShareDocuments = (e) => {
        e.preventDefault();
        window.localStorage.removeItem('sharedocs');
        if (selectedrows.length == 0) {
            setContentText('Bạn chưa chọn Tài liệu để chia sẻ!!!');
            setOpen(true);
        } else {
            window.localStorage.setItem('sharedocs', JSON.stringify(selectedrows));
            router.push({
                pathname: PATH_DASHBOARD.processDoc.sharedocs,
                query: {
                    doc: JSON.stringify(selectedrows)
                }
            }, PATH_DASHBOARD.processDoc.sharedocs, { shallow: true });
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenConfirm = () => {
        if (selectedrows.length > 0) {
            setOpenConfirm(true);
        } else {
            setOpen(true);
            setContentText('Bạn chưa chọn Tài liệu để xóa!!!');
        }
    };
    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleOpenDeleteConfirm = () => {
        if (folderid != null) {
            setOpenDeleteConfirm(true);
        } else {
            setOpen(true);
            setContentText('Bạn chưa chọn Thư mục để xóa!!!');
        }
    };
    const handleCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
    };

    const handleDeleteRows = async () => {
        let check = false;
        for (let index = selectedrows.length - 1; index >= 0; --index) {
            const doc = selectedrows[index];
            try {
                const deleteRows = await deleteDocument(doc.id);
                if (deleteRows.code == 'ERR_BAD_REQUEST') {
                    check = true;
                    setTimeout(() => {
                        enqueueSnackbar(deleteRows.response.data.title);
                    }, "1000");
                }
            } catch (ex) {
                console.log('handleDrop', error);
            }
        }
        if (!check) {
            setSelectedRows([]);
            setOpen(true);
            setContentText('Bạn đã xóa dữ liệu thành công!');
            setGridrows([]);
            setSelectionModel([]);
            setTimeout(() => {
                fetchGridData(folderid, foldername);
            }, "2000");
        }
    };

    const renderTree = (nodes) => (
        <CustomTreeItem key={nodes.id} nodeId={nodes.id ? nodes.id : "defaultNodeId"} label={nodes.name ? nodes.name : "defaultNodeName"}
        >
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
        </CustomTreeItem>
    );

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'left',
        color: theme.palette.text.secondary,
    }));

    const handleDocDetails = async (currentRow) => {
        const message = await dispatch(getOneDocumentRedux(currentRow.id));
        if (message && message.variant) {
            enqueueSnackbar(message.title, { variant: message.variant });
            return;
        }
        router.push(PATH_DASHBOARD.processDoc.docdetail(currentRow.id));
    };

    const handleUpdate = async (currentRow) => {
        console.log('currentRow', currentRow);
        const message = await dispatch(getOneDocumentRedux(currentRow.id));
        if (message && message.variant) {
            enqueueSnackbar('Bạn không có quyền chỉnh sửa Tài liệu này', { variant: message.variant });
            return;
        } else {
            dispatch(createDocumentInitialRedux());
            window.localStorage.setItem('editdocs', JSON.stringify(currentRow.row));
            router.push({
                pathname: PATH_DASHBOARD.processDoc.editdoc(currentRow.id),
                query: {
                    folderid: currentRow.row.folderId,
                    docid: currentRow.row.id,
                    foldername: currentRow.row.foldername,
                }
            });
        }
        //return alert(JSON.stringify(currentRow, null, 4)); 
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        //{
        //    field: 'code',
        //    headerName: 'Mã file',
        //    width: 200,
        //},
        {
            field: 'name',
            headerName: 'Tài liệu',
            width: 250,
        },
        {
            field: 'fullname',
            headerName: 'Người tạo',
            width: 150,
        },
        {
            field: 'createDate',
            valueFormatter: params =>
                moment(params?.value).format("DD/MM/YYYY"),
            headerName: 'Ngày tạo',
            width: 100,
            align: 'left'
        },
        {
            width: 250,
            field: 'typedoc',
            headerName: "Thông tin File",
            sortable: false,
            renderCell: ({ row }) =>
                <div style={{ fontSize: 13 }}>
                    <Typography style={{ fontSize: 14 }}> Môn: {row.subjectname}</Typography>
                    <Typography style={{ fontSize: 12 }}>File: {row.urlDocument}</Typography>
                    <Typography style={{ fontSize: 12 }}> Loại file: {row.typeFile}</Typography>
                    <Typography style={{ fontSize: 12 }}> Size: {row.size}</Typography>
                </div>

        },
        {
            field: 'action',
            headerName: 'Action',
            width: 180,
            sortable: false,
            align: 'center',
            disableClickEventBubbling: true,
            renderCell: (rowData) => {
                return (
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" color="info" size="small" onClick={() => handleDocDetails(rowData)}><InfoOutlinedIcon fontSize="small" /></Button>
                        <Button variant="outlined" color="warning" size="small" onClick={() => handleUpdate(rowData)}><EditOutlinedIcon fontSize="small" /></Button>
                    </Stack>
                );
            },
        },
    ];

    const handleChange = (event, nodes) => {
        setExpanded(nodes);
        console.log(nodes);
    };

    const fetchFolderTreeData = async () => {
        console.log('ON fetchFolderTreeData')
        const response = await getFolderTree()
        const json = await response.data;
        setData(json.data[0]);
        console.log(json.data);
    };
    useEffect(() => {
        if (!loaded) {
            fetchFolderTreeData();
            console.log(data);
            setLoaded(true);
            fetchGridData(0);
            setExpanded(["72"]);
        }
    }, []);

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
        console.log(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
        console.log("node", nodeIds);
        console.log("event", event.target.innerText);
        fetchGridData(nodeIds, event.target.innerText);
    };
    const handleOpenNewStoreFolder = () => {
        setOpenNewStoreFolder(true);
    };

    const handleCloseNewStoreFolder = () => {
        setOpenNewStoreFolder(false);
    };
    const handleChangeStoreFolderName = useCallback((event) => {
        setStoreFolderName(event.target.value);
    }, []);
    const handleCreateNewStoreFolder = () => {
        console.log('CREATE NEW FOLDER', storeFolderName);
        setStoreFolderName('');
        dispatch(
            createStoreFolderRedux({
                name: storeFolderName,
                parentId: Number.parseInt(folderid),
            })
        );
        console.log('parentid', Number.parseInt(folderid));
        enqueueSnackbar('Bạn đã tạo thư mục học liệu thành công!!!');
        handleCloseNewStoreFolder();
        setTimeout(() => {
            fetchFolderTreeData();
        }, "1000");
    };
    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };
    const handleClosePopover = () => {
        setOpenPopover(null);
    };
    const handleOpenEditFolder = () => {
        setOpenEditFolder(true);
    };
    const handleCloseEditFolder = () => {
        setOpenEditFolder(false);
    };

    const handleUpdateSubFolder = async () => {
        const message = await dispatch(updateSubStoreFolderRedux(folderid, { name: foldername }));
        if (message) {
            enqueueSnackbar(message.title, { variant: message.variant });
            setTimeout(() => {
                fetchFolderTreeData();
            }, "1000");
        }
        setFolderName(foldername);
        handleCloseEditFolder();
    };
    const handleDeleteFolder = async () => {
        const message = await dispatch(deleteSubFolderInStoreFolderRedux(folderid));
        if (message) {
            enqueueSnackbar(message.title, { variant: message.variant });
        }
        handleCloseDeleteConfirm();
        setFolderName('');
        setFolderID(null);
        setTimeout(() => {
            fetchFolderTreeData();
        }, "1000");
        setTimeout(() => {
            fetchGridData(0);;
        }, "2000");
    };
    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>
            <Container maxWidth={'xl'}>
                <CustomBreadcrumbs
                    heading="Xử lý học liệu"
                    links={[
                        { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                        { name: 'Xử lý Tài liệu học liệu', href: PATH_DASHBOARD.processDoc.root },
                        { name: 'Danh sách' },
                    ]}
                />
                {foldername && (
                    <strong style={{
                        color: 'blue',
                        fontSize: 18
                    }}>
                        Bạn đã chọn Thư mục: {foldername}
                        <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </strong>
                )}
                <Grid container spacing={1}>
                    <Grid item xs={2} style={{ borderRight: "1px solid blue" }}>
                        <Item>
                            <TreeView
                                defaultCollapseIcon={<ArrowDropDownIcon />}
                                defaultExpandIcon={<ArrowRightIcon />}
                                defaultEndIcon={<div style={{ width: 18 }} />}
                                sx={{ height: 'auto', flexGrow: 1, maxWidth: 250, overflowY: 'auto' }}
                                expanded={expanded}
                                selected={selected}
                                onNodeToggle={handleToggle}
                                onNodeSelect={handleSelect}
                            >
                                {renderTree(data)}
                            </TreeView>
                        </Item>
                    </Grid>
                    <Grid item xs={10} >
                        <Item>
                            <Box sx={{ height: 650, width: '100%' }}>
                                <AppBar position="static">
                                    <Toolbar variant="dense">
                                        <Box sx={{ flexGrow: 1 }} />
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: 'fit-content',
                                                border: (theme) => `1px solid ${theme.palette.divider}`,
                                                borderRadius: 1,
                                                '& svg': {
                                                    m: 0.5,
                                                },
                                                '& hr': {
                                                    mx: 0.5,
                                                },
                                            }}
                                        >
                                            <Tooltip title="Thêm tài liệu" placement="top">
                                                <IconButton
                                                    size="small"
                                                    edge="start"
                                                    color="inherit"
                                                    aria-label="open drawer"
                                                    sx={{ mr: 2 }}
                                                    onClick={handleOpenFormUploadDocument}
                                                >
                                                    <AddToDriveIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Divider orientation="vertical" flexItem variant="middle" style={{ minHeight: 'inherit', backgroundColor: "white", width: '1px' }} />
                                            <Tooltip title="Xóa tài liệu" placement="top">
                                                <IconButton
                                                    size="small"
                                                    edge="start"
                                                    color="inherit"
                                                    aria-label="open drawer"
                                                    sx={{ mr: 2 }}
                                                    onClick={handleOpenConfirm}
                                                >
                                                    <DeleteForeverIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Divider orientation="vertical" flexItem variant="middle" style={{ minHeight: "inherit", backgroundColor: "white", width: "1px" }} />
                                            <Tooltip title="Chia sẻ tài liệu" placement="top">
                                                <IconButton
                                                    size="small"
                                                    edge="start"
                                                    color="inherit"
                                                    aria-label="open drawer"
                                                    sx={{ mr: 2 }}
                                                    onClick={handleOpenFormShareDocuments}
                                                >
                                                    <ShareIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Toolbar>
                                </AppBar>
                                <DataGrid
                                    rows={gridrows}
                                    columns={columns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10]}
                                    checkboxSelection
                                    disableSelectionOnClick
                                    getRowHeight={() => 'auto'}
                                    onSelectionModelChange={(ids) => {
                                        setSelectionModel(ids);
                                        const selectedIDs = new Set(ids);
                                        const selectedRows = gridrows.filter((row) =>
                                            selectedIDs.has(row.id),
                                        );
                                        console.log(selectedRows);
                                        setSelectedRows(selectedRows);
                                    }}
                                    selectionModel={selectionModel}
                                    sx={datagridSx}
                                />
                            </Box>
                        </Item>
                    </Grid>
                </Grid>
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
            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Xóa"
                content={<>Bạn có chắc chắn muốn xóa Danh sách tài liệu này?</>}
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteRows();
                            handleCloseConfirm();
                        }}
                    >
                        Xóa
                    </Button>
                }
            />

            {openEditFolder && (
                <FileNewFolderDialog
                    open={openEditFolder}
                    onClose={handleCloseEditFolder}
                    title="Sửa Thư mục"
                    onUpdate={handleUpdateSubFolder}
                    folderName={foldername}
                    onChangeFolderName={(event) => setFolderName(event.target.value)}
                />
            )}
            {openDeleteConfirm && (
                <ConfirmDialog
                    open={openDeleteConfirm}
                    onClose={handleCloseDeleteConfirm}
                    title="Xóa thư mục"
                    content="Bạn có chắc chắn muốn xóa thư mục này?"
                    action={
                        <Button variant="contained" color="error" onClick={handleDeleteFolder}>
                            Xóa
                        </Button>
                    }
                />
            )}
            <FileNewFolderDialog
                open={openNewStoreFolder}
                onClose={handleCloseNewStoreFolder}
                title="New Folder"
                folderName={storeFolderName}
                onChangeFolderName={handleChangeStoreFolderName}
                onCreate={handleCreateNewStoreFolder}
            />
            <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="left-top" sx={{ width: 120 }}>
                <MenuItem
                    onClick={() => {
                        handleClosePopover();
                        handleOpenNewStoreFolder();
                    }}
                >
                    <Iconify icon="eva:folder-add-fill" />
                    Thêm mới
                </MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <MenuItem
                    onClick={() => {
                        handleClosePopover();
                        handleOpenEditFolder();
                    }}
                >
                    <Iconify icon="eva:edit-fill" />
                    Đổi tên
                </MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <MenuItem
                    onClick={() => {
                        handleOpenDeleteConfirm();
                        handleClosePopover();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="eva:trash-2-outline" />
                    Xóa
                </MenuItem>
            </MenuPopover>
        </>
    );
}
