import PropTypes from 'prop-types';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
// @mui
import { AvatarGroup, Box, Button, Checkbox, Divider, IconButton, MenuItem, Stack, Typography } from '@mui/material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
import useCopyToClipboard from '../../../../hooks/useCopyToClipboard';
// utils

// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import MenuPopover from '../../../../components/menu-popover';
import { DocumentViewer } from '../../../../components/viewer';
import FileThumbnail, { fileFormat } from '../../../../components/file-thumbnail';
import { memo } from 'react';
// POPUP
import { FileDetailsDrawer, FileShareDialog } from '../../file';
import { checkDocCloseOpen } from '../../../../dataProvider/agent';
import { dispatch } from 'src/redux/store';
import { getOneDocumentRedux, startDownloadFileRedux } from 'src/redux/slices/document';
import { deleteDocumentInFolderRedux, deleteDocumentInStoreFolderRedux } from '../../../../redux/slices/folder';

import ConfirmDialog from 'src/components/confirm-dialog';
import { ROLES_CODE, URL_GLOBAL } from '../../../../config';
import { deleteDocumentInSubjectRedux } from 'src/redux/slices/subject';
import { useAuthContext } from 'src/auth/useAuthContext';
import Label from '../../../../components/label';
// ----------------------------------------------------------------------

const FileGeneralRecentCard = ({ data, file, onDelete, handleOpenPopupSaveInMyFolder, sx, ...other }) => {
    const { user } = useAuthContext();
    console.log('FileGeneralRecentCards', file);
    const { enqueueSnackbar } = useSnackbar();

    const isDesktop = useResponsive('up', 'sm');

    const [isOpen, setIsOpen] = useState(false);
    const [defaultScale] = useState(0.6);

    const [openPopover, setOpenPopover] = useState(null);

    const [fileUrl, setFileUrl] = useState('');

    const [openShare, setOpenShare] = useState(false);

    const [openDetails, setOpenDetails] = useState(false);

    const [openConfirmAddDocument, setOpenConfirmAddDocument] = useState(false);
    const [openConfirmDeleteFile, setOpenConfirmDeleteFile] = useState(false);


    const handleOpenShare = async () => {
        handleClosePopover();
        await dispatch(getOneDocumentRedux(file.id));
        setOpenShare(true);
    };

    const handleCloseShare = () => {
        setOpenShare(false);
    };

    const handleOpenDetails = async () => {
        console.log('handlePreviewFile', data, file.id);
        // Chia sẻ lên thư mục chung
        const message = await dispatch(getOneDocumentRedux(file.id));
        console.log('message', message);
        if (message && message.variant) {
            enqueueSnackbar(message.title, { variant: message.variant });
        } else {
            setOpenDetails(true);
        }
        //if (
        //    data.types.find(
        //        (type) =>
        //            type === 'folderUploadDoc' ||
        //            (type === 'folderUploadDocToSlot' && data.panel) ||
        //            type === 'folderUploadDocToSlotInGeneralFolder'
        //    )
        //) {
        //    setOpenConfirmAddDocument(true);
        //    return;
        //} else if (data.types.find((type) => type === 'folder')) {
        //    const message = await dispatch(getOneDocumentRedux(file.id));
        //    console.log('message', message);
        //    if (message && message.variant) {
        //        enqueueSnackbar(message.title, { variant: message.variant });
        //    } else {
        //        setOpenDetails(true);
        //    }
        //} else {
        //    enqueueSnackbar('Không thực hiện được thao tác này', { variant: 'error' });
        //}
    };

    const handleCloseDetails = () => {
        setOpenDetails(false);
    };

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    const handleDownloadFile = async () => {
        const response = await checkDocCloseOpen(file.id);
        const json = await response.data
        if (json.errorCode == 200) {
            handleClosePopover();
            const message = await dispatch(startDownloadFileRedux(file, URL_GLOBAL.DOWNLOAD_FILE));
            if (message) {
                enqueueSnackbar(message.title, { variant: message.variant });
            }
        } else {
            enqueueSnackbar(`${json.message}`, { variant: 'error' });
        }
    };

    const handlePreviewFile = useCallback(async () => {
        console.log('handlePreviewFile', data, file.id);
        const response = await checkDocCloseOpen(file.id);
        const json = await response.data
        if (json.errorCode == 200) {
            setIsOpen(true);
            setFileUrl(`${URL_GLOBAL.VIEW_FILE}${file.urlDocument}`);
            //window.open(`${URL_GLOBAL.VIEW_FILE}${file.urlDocument}`, '_blank', 'noopener,noreferrer');
        } else {
            enqueueSnackbar(`${json.message}`, { variant: 'error' });
        }

    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleCloseConfirmAddDocument = () => {
        setOpenConfirmAddDocument(false);
    };

    const handleDeleteFile = async () => {
        console.log('handleDeleteDocument', data, file.id);
        if (data.types.find((type) => type === 'folderUploadDocToSlot')) {
            const message = await dispatch(
                deleteDocumentInSubjectRedux({ id: data.class_id, docsId: file.id, slotId: data.slotId, index: data.index })
            );
            if (message) {
                enqueueSnackbar(message.title, { variant: message.variant });
            }
            setOpenConfirmDeleteFile(false);
            handleClosePopover();
            return;
        } else if (data.types.find((type) => type === 'folder') || data.types.find((type) => type === 'storeFolder')) {
            const message = await dispatch(deleteDocumentInFolderRedux(file.id, data.types[0]));
            if (message) {
                enqueueSnackbar(`Xoá tài liệu thành công ${message.title}`, { variant: message.variant });
            }
            setOpenConfirmDeleteFile(false);
            handleClosePopover();
        } else {
            enqueueSnackbar(`Không xóa được tài liệu tại đây`, { variant: `error` });
        }
    };

    return (
        <>
            <Stack
                spacing={isDesktop ? 1.5 : 2}
                direction={isDesktop ? 'row' : 'column'}
                alignItems={isDesktop ? 'center' : 'flex-start'}
                sx={{
                    p: 2.5,
                    borderRadius: 2,
                    position: 'relative',
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                    '&:hover': {
                        bgcolor: 'background.paper',
                        boxShadow: (theme) => theme.customShadows.z20,
                        cursor: 'pointer',
                    },
                    ...(isDesktop && {
                        p: 1.5,
                        borderRadius: 1.5,
                    }),
                    ...sx,
                }}
                {...other}
            >
                <FileThumbnail file={file.typeFile} sx={{ width: 50, height: 50 }} imgSx={{ borderRadius: 1 }} />

                <Stack
                    onClick={handleOpenDetails}
                    sx={{
                        width: 1,
                        flexGrow: { sm: 1 },
                        minWidth: { sm: '1px' },
                    }}
                >
                    <Typography variant="subtitle2" noWrap>
                        {file.name}
                    </Typography>

                    <Stack
                        spacing={0.75}
                        direction="row"
                        alignItems="center"
                        sx={{ typography: 'caption', color: 'text.disabled', mt: 0.5 }}
                    >
                        {file.programName ? (
                            <Box>
                                {`${file.code} / ${file.programName} / ${file.subjectName} / ${file.typeDocumentName}`}
                            </Box>
                        ) : (
                            <Box> {`Loại file: ${file.typeFile}`} </Box>
                        )}
                    </Stack>
                </Stack>

                {isDesktop && (
                    <AvatarGroup
                        max={4}
                        sx={{
                            mx: 1.5,
                            '& .MuiAvatarGroup-avatar': {
                                width: 24,
                                height: 24,
                                '&:first-of-type': {
                                    fontSize: 12,
                                },
                            },
                        }}
                    >
                        {file?.shared?.map((person) => (
                            <Avatar key={person.id} alt={person.name} src={person.avatar} />
                        ))}
                    </AvatarGroup>
                )}

                <Box
                    sx={{
                        top: 8,
                        right: 8,
                        flexShrink: 0,
                        position: 'absolute',
                        ...(isDesktop && {
                            position: 'unset',
                        }),
                    }}
                >
                    {!_.isEmpty(data?.menuDocument) && (
                        <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    )}
                </Box>
            </Stack>

            <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 220 }}>
                {(file.permissAction == 0 || file.permissAction == 1) && (
                    <MenuItem onClick={handlePreviewFile}>
                        <Iconify icon="eva:link-2-fill" />
                        Xem trước
                    </MenuItem>
                )}

                {file.permissAction == 1 && (
                    <MenuItem onClick={handleDownloadFile}>
                        <Iconify icon="eva:download-outline" />
                        Tải xuống
                    </MenuItem>
                )}
                {/* ẩn đi với role HOCSINH 
                {data?.menuDocument.find((element) => element === 'saveInMyFolder') &&
                    !user.roles.find((role) => role.name === ROLES_CODE.STUDENT) && (
                        <MenuItem onClick={() => handleOpenPopupSaveInMyFolder({ document: file })}>
                            <Iconify icon="simple-line-icons:docs" />
                            Tải về kho của tôi
                        </MenuItem>
                    )}
                */}
                {data?.menuDocument.find((element) => element === 'share') && (
                    <MenuItem onClick={handleOpenShare}>
                        <Iconify icon="eva:share-fill" />
                        Chia sẻ
                    </MenuItem>
                )}

                {data?.menuDocument.find((element) => element === 'delete') &&
                    (user.roles.find((role) => role.name === ROLES_CODE.STUDENT) ? (
                        ''
                    ) : (
                        <>
                            <Divider sx={{ borderStyle: 'dashed' }} />

                            <MenuItem
                                onClick={() => {
                                    setOpenConfirmDeleteFile(true);
                                }}
                                sx={{ color: 'error.main' }}
                            >
                                <Iconify icon="eva:trash-2-outline" />
                                Xóa
                            </MenuItem>
                        </>
                    ))}
            </MenuPopover>

            {openDetails && (
                <FileDetailsDrawer
                    open={openDetails}
                    onClose={handleCloseDetails}
                />
            )}

            <ConfirmDialog
                open={openConfirmAddDocument}
                onClose={handleCloseConfirmAddDocument}
                title="Thêm tài liệu"
                content={<>Bạn có chắc chắn muốn thêm tài liệu ?</>}
                action={
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                            if (data.types.find((type) => type === 'folderUploadDoc')) {
                                data.handleUploadDocumentToStoreFolder(file.id);
                            } else if (
                                data.types.find(
                                    (type) => type === 'folderUploadDocToSlot' || type === 'folderUploadDocToSlotInGeneralFolder'
                                )
                            ) {
                                data.handleAddDocumentToSlot(file.id);
                            }
                            handleCloseConfirmAddDocument();
                        }}
                    >
                        Thêm tài liệu
                    </Button>
                }
            />
            {openShare && (
                <FileShareDialog
                    file={file}
                    open={openShare}
                    data={file}
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
            <Dialog open={isOpen} onClose={handleClose} fullScreen>
                <DialogTitle textAlign="center">{file.name}
                    {isOpen ? (
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </DialogTitle>
                <DialogContent dividers> 
                        <DocumentViewer fileUrl={fileUrl} /> 
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FileGeneralRecentCard;
