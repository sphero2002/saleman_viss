import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import {
    Box,
    Card,
    Table,
    Button,
    Divider,
    MenuItem,
    TableRow,
    TableBody,
    TableCell,
    CardHeader,
    IconButton,
    TableContainer,
    Pagination,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import MenuPopover from '../../../../components/menu-popover';
import { TableHeadCustom } from '../../../../components/table';
import { dispatch } from "../../../../redux/store";
import { getOneDocumentRedux, startDownloadFileRedux } from "../../../../redux/slices/document";
import { FileDetailsDrawer, FileShareDialog } from "../../file";
import { URL_GLOBAL } from "../../../../config";
import { useSnackbar } from "../../../../components/snackbar";
import ConfirmDialog from "../../../../components/confirm-dialog";
import { deleteDocumentInSubjectRedux } from "../../../../redux/slices/subject";
import { deleteDocumentInFolderRedux, deleteDocumentInStoreFolderRedux } from "../../../../redux/slices/folder";
import { deleteDocument, checkDocCloseOpen } from "../../../../dataProvider/agent";

// ----------------------------------------------------------------------

AppNewInvoice.propTypes = {
    title: PropTypes.string,
    tableData: PropTypes.array,
    subheader: PropTypes.string,
    tableLabels: PropTypes.array,
};

export default function AppNewInvoice({
    handlePageChange,
    title,
    paging,
    subheader,
    setReportDocs,
    tableData,
    tableLabels,
    ...other
}) {
    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

            <TableContainer sx={{ overflow: 'unset' }}>
                <Scrollbar>
                    <Table>
                        <TableHeadCustom headLabel={tableLabels} />

                        <TableBody>
                            {tableData?.map((row) => (
                                <AppNewInvoiceRow key={row.id} row={row} setReports={setReportDocs} />
                            ))}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>

            <Divider />

            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <></>
                <Pagination
                    size="small"
                    count={paging?.TotalPages}
                    rowsperpage={paging?.PageSize}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Card>
    );
}

// ----------------------------------------------------------------------
function AppNewInvoiceRow({ row, setReports }) {
    const { enqueueSnackbar } = useSnackbar();
    const [openPopover, setOpenPopover] = useState(null);
    const [openShare, setOpenShare] = useState(false);
    const [openConfirmDeleteFile, setOpenConfirmDeleteFile] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };


    const handleOpenDetails = async () => {
        try {
            const message = await dispatch(getOneDocumentRedux(row.document.id));
            if (message && message.variant) {
                enqueueSnackbar(message.title, { variant: message.variant });
            } else {
                setOpenDetails(true);
            }
        } catch (e) {
            enqueueSnackbar('Không thực hiện được thao tác này', { variant: 'error' });
        }
    };


    const handleCloseDetails = () => {
        setOpenDetails(false);
    };


    const handleDownload = async () => {
        console.log('AppNewInvoice-handleDownload', row, row.document.id);
        const response = await checkDocCloseOpen(row.document.id);
        const json = await response.data;
        if (json.errorCode == 200) {
            handleClosePopover();
            handleClosePopover();
            const message = await dispatch(startDownloadFileRedux(row.document, URL_GLOBAL.DOWNLOAD_FILE));
            if (message) {
                enqueueSnackbar(message.title, { variant: message.variant });
            }
        } else {
            enqueueSnackbar(`${json.message}`, { variant: 'error' });
        }
    };

    const handlePreviewFile = useCallback(async () => {
        console.log('AppNewInvoice-handlePreviewFile', row, row.document.id);
        const response = await checkDocCloseOpen(row.document.id);
        const json = await response.data;
        if (json.errorCode == 200) {
            window.open(`${URL_GLOBAL.VIEW_FILE}${row.document.urlDocument}`, '_blank', 'noopener,noreferrer');
        } else {
            enqueueSnackbar(`${json.message}`, { variant: 'error' });
        }
    }, []);


    const handleOpenShare = async () => {
        const response = await checkDocCloseOpen(row.document.id);
        const json = await response.data;
        if (json.errorCode == 200) {
            handleClosePopover();
            console.log('row.document.id', row.document.id)
            await dispatch(getOneDocumentRedux(row.document.id));
            setOpenShare(true);
        } else {
            enqueueSnackbar(`${json.message}`, { variant: 'error' });
        }
    };

    const handleCloseShare = () => {
        setOpenShare(false);
    };

    const handleDeleteFile = async () => {
        try {
            const message = await deleteDocument(row.document.id);
            if (message.status < 400) {
                enqueueSnackbar('Xóa tài liệu thành công', { variant: 'success' });
                setOpenConfirmDeleteFile(false);
                setReports();
            } else {
                enqueueSnackbar(`${message.response.data.title}`, { variant: 'error' });
            }
        } catch (e) {
            enqueueSnackbar('Đã có lỗi xảy ra', { variant: 'error' });
        }
    };

    return (
        <>
            <TableRow>
                <TableCell>{row.document.code}</TableCell>

                <TableCell>{row.document.name}</TableCell>

                <TableCell>{fDate(row.document.createDate)}</TableCell>

                <TableCell>
                    {row.userDto.firstName} {row.userDto.lastName}
                </TableCell>

                <TableCell>{row.userDto.email}</TableCell>

                <TableCell>{row.userDto.phone}</TableCell>

                <TableCell align="right">
                    <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
                <MenuItem
                    onClick={() => {
                        handleClosePopover();
                        handleOpenDetails();
                    }}
                >
                    <Iconify icon="eva:eye-fill" />
                    Chi tiết
                </MenuItem>
                {(row.document.typeFile == 'audio/mpeg' ||
                    row.document.typeFile == 'video/mp4' ||
                    row.document.typeFile == 'image/jpeg' ||
                    row.document.typeFile == 'image/png' ||
                    row.document.typeFile == 'application/pdf') && (
                        <MenuItem onClick={handlePreviewFile}>
                            <Iconify icon="eva:link-2-fill" />
                            Xem trước
                        </MenuItem>
                    )}
                <MenuItem onClick={handleDownload}>
                    <Iconify icon="eva:download-fill" />
                    Tải xuống
                </MenuItem>

                <MenuItem onClick={handleOpenShare}>
                    <Iconify icon="eva:share-fill" />
                    Chia sẻ
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem
                    onClick={() => {
                        handleClosePopover();
                        setOpenConfirmDeleteFile(true);
                    }}
                    sx={{ color: 'error.main' }}>
                    <Iconify icon="eva:trash-2-outline" />
                    Xóa
                </MenuItem>
            </MenuPopover>
            {openDetails && (
                <FileDetailsDrawer
                    open={openDetails}
                    onClose={handleCloseDetails}
                />
            )}
            {openShare && (
                <FileShareDialog
                    file={row.document}
                    open={openShare}
                    data={row.document}
                    onClose={() => {
                        handleCloseShare();
                    }}
                />
            )}
            {openConfirmDeleteFile && (
                <ConfirmDialog
                    open={openConfirmDeleteFile}
                    onClose={() => setOpenConfirmDeleteFile(false)}
                    title="Xóa Tài Liệu"
                    content="Bạn có chắc chắn muốn xóa tài liệu này?"
                    action={
                        <Button variant="contained" color="error" onClick={handleDeleteFile}>
                            Xóa
                        </Button>
                    }
                />
            )}
        </>
    );
}
