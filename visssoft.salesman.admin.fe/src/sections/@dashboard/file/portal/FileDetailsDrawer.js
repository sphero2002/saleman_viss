import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Box, Button, Checkbox, Divider, Drawer, IconButton, List, Stack, Typography } from '@mui/material';
// utils
import { fData } from '../../../../utils/formatNumber';
import { fDateTime } from '../../../../utils/formatTime';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import FileThumbnail, { fileFormat } from '../../../../components/file-thumbnail';
//
import FileInvitedItem from '../FileInvitedItem';
import { getDocumentById, getProgramById, getSubjectById } from '../../../../dataProvider/agent';
import { useSelector } from 'react-redux';
import { dispatch } from '../../../../redux/store';
import { createDocumentInitialRedux } from '../../../../redux/slices/folder';
import { getProgramRedux } from '../../../../redux/slices/program';

// ----------------------------------------------------------------------

// FileDetailsDrawer.propTypes = {
//   open: PropTypes.bool,
//   item: PropTypes.object,
//   onClose: PropTypes.func,
//   onDelete: PropTypes.func,
//   favorite: PropTypes.bool,
//   onFavorite: PropTypes.func,
// };

export default function FileDetailsDrawer({
    data,
    open,
    favorite,
    //
    onFavorite,
    onClose,
    onDelete,
    ...other
}) {
    const { getOne } = useSelector((state) => state.document);

    const hasShared = getOne && !!getOne.listShare.length;

    const [toggleProperties, setToggleProperties] = useState(true);

    const [toggleCategories, setToggleCategories] = useState(true);

    const handleToggleProperties = () => {
        setToggleProperties(!toggleProperties);
    };

    const handleToggleCategories = () => {
        setToggleCategories(!toggleCategories);
    };

    return (
        <>
            {getOne && (
                <Drawer
                    open={open}
                    onClose={onClose}
                    anchor="right"
                    BackdropProps={{
                        invisible: true,
                    }}
                    PaperProps={{
                        sx: { width: 370 },
                    }}
                    {...other}
                >
                    <Scrollbar sx={{ height: 1 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
                            <Typography variant="h6"> Thông tin chi tiết </Typography>

                        </Stack>

                        <Stack spacing={2.5} justifyContent="center" sx={{ p: 2.5, bgcolor: 'background.neutral' }}>
                            <FileThumbnail file={getOne.urlDocument} sx={{ width: 64, height: 64 }} imgSx={{ borderRadius: 1 }} />

                            <Typography variant="h6" sx={{ wordBreak: 'break-all' }}>
                                {`Tài liệu: ${getOne.name}`}
                            </Typography>

                            <Typography variant="h7" sx={{ wordBreak: 'break-all' }}>
                                {`Tệp đính kèm: ${getOne.urlDocument}`}
                            </Typography>

                            <Divider sx={{ borderStyle: 'dashed' }} />

                            <Stack spacing={1.5}>
                                <Panel label="Danh mục" toggle={toggleCategories} onToggle={handleToggleCategories} />

                                {toggleCategories && getOne ? (
                                    <>
                                        <Stack spacing={1.5}>
                                            <Row label="Chương trình học" value={getOne.programName} />

                                            <Row label="Môn học" value={getOne.subjectName} />

                                            <Row label="Loại tài liệu" value={getOne.typeDocumentName} />
                                        </Stack>
                                    </>
                                ) : (
                                    ''
                                )}
                            </Stack>

                            <Divider sx={{ borderStyle: 'dashed' }} />

                            <Stack spacing={1.5}>
                                <Panel label="Thuộc tính" toggle={toggleProperties} onToggle={handleToggleProperties} />

                                {toggleProperties && (
                                    <>
                                        <Stack spacing={1.5}>
                                            <Row label="Kích thước" value={`${getOne.size} MB`} />

                                            <Row label="Ngày tạo" value={fDateTime(getOne.createDate)} />

                                            <Row label="Loại" value={fileFormat(getOne.typeFile)} />
                                        </Stack>
                                    </>
                                )}
                            </Stack>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
                            <Typography variant="subtitle2"> Được chia sẻ với {getOne.listShare.length} người  </Typography>
                        </Stack>

                        {hasShared && (
                            <List disablePadding sx={{ pl: 2.5, pr: 1 }}>
                                {getOne.listShare.map(({ user, permission }, index) => (
                                    <FileInvitedItem key={user.id} user={user} permissionDefault={permission} index={index} />
                                ))}
                            </List>
                        )}
                    </Scrollbar>

                    <Box sx={{ p: 2.5 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Button
                                fullWidth
                                variant="soft"
                                color="error"
                                size="large"
                                startIcon={<Iconify icon="eva:arrow-back-fill" />}
                                onClick={onClose}
                            >
                                Thoát
                            </Button>
                        </Stack>
                    </Box>
                </Drawer>
            )}
        </>
    );
}

// ----------------------------------------------------------------------

Panel.propTypes = {
    toggle: PropTypes.bool,
    label: PropTypes.string,
    onToggle: PropTypes.func,
};

function Panel({ label, toggle, onToggle, ...other }) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" {...other}>
            <Typography variant="subtitle2"> {label} </Typography>

            <IconButton size="small" onClick={onToggle}>
                <Iconify icon={toggle ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />
            </IconButton>
        </Stack>
    );
}

// ----------------------------------------------------------------------

Row.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
};

function Row({ label, value = '' }) {
    return (
        <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 120, color: 'text.secondary', mr: 2 }}>
                {label}
            </Box>

            {value}
        </Stack>
    );
}
