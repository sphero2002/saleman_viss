import { useEffect, useState, useCallback, useRef, useMemo, forwardRef, Fragment } from 'react';
// COMPONENT
import PropTypes from 'prop-types';
import clsx from 'clsx';
// @mui
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
import { LoadingButton } from '@mui/lab';
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
import {
    DataGrid, GridColDef, GridRowModes, GridToolbarContainer, GridActionsCellItem, GridSelectionModel
} from '@mui/x-data-grid';
//lib
import moment from 'moment';
import dayjs from "dayjs";
import MenuPopover from '../../../../components/menu-popover';
import Iconify from '../../../../components/iconify';
import { useSelector } from 'react-redux';
import { dispatch } from '../../../../redux/store';
import { getCommonFiles, getFolderTree } from '../../../../dataProvider/agent';
import { copyDocsToFolderRedux, getFolderRedux } from 'src/redux/slices/folder';
import { postDocumentsInSlotRedux } from 'src/redux/slices/subject';
import { useSnackbar } from 'notistack';

UploadDocToSlot.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    slotId: PropTypes.number,
};
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

const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
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

    }
];
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

export default function UploadDocToSlot({ open, onClose, slotId, classId, subjectId }) {
    const { folderUploadDocToSlot, folderUploadDocToSlotInGeneralFolder } = useSelector((state) => state.folder);
    const { enqueueSnackbar } = useSnackbar();
    const [selected, setSelected] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [data, setData] = useState({}); //Set Data Tree
    const [gridrows, setGridrows] = useState([]); //Set Data Grid
    const [selectionModel, setSelectionModel] = useState([]);
    const [selectedrows, setSelectedRows] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [foldername, setFolderName] = useState("");
    const [folderid, setFolderID] = useState(null);

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

    const fetchGridData = async (id, name) => {
        console.log('ON fetchGridData', id)
        const response = await getCommonFiles(id);
        const json = await response.data;
        setGridrows(json.data);
        console.log(json.data);
        setFolderName(name);
        setFolderID(id);
    }
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

    const handleAddDocumentToSlot = (documentId) => {
        if (selectedrows.length == 0) {
            enqueueSnackbar('Bạn chưa chọn Tài liệu để chia sẻ!!!');
        } else {
            selectedrows.forEach(function (row) {
                console.log('postData', classId, row.id, slotId, subjectId);
                setTimeout(async function () {
                    const message = await dispatch(postDocumentsInSlotRedux(classId, row.id, slotId, subjectId));
                    if (message) {
                        enqueueSnackbar(message.title, { variant: message.variant });
                    }
                }, 2000);

            });
        }
    };

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
                {foldername && (
                    <strong style={{
                        color: 'blue',
                        fontSize: 18
                    }}>
                        Bạn đã chọn Thư mục: {foldername}
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
                            <Box sx={{ height: 450, width: '100%' }}>
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
                <Divider />
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
                            onClick={handleAddDocumentToSlot}
                        >
                            Gán tài liệu
                        </LoadingButton>
                    </Stack>
                </Stack>
            </Container>
        </Dialog>
    );
}
