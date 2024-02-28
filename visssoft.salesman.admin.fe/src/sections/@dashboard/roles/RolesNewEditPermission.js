import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Button, Chip, Divider, Stack, Typography } from '@mui/material';
// hooks
// _mock
// components
//
import PermissionListDialog from './PermissionListDialog';
import { getAllPermission } from '../../../dataProvider/agent';
import useResponsive from '../../../hooks/useResponsive';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function RolesNewEditPermission({ selectedPermissions, handleSelectedPermission, permissions }) {
    const {
        watch,
        getValues,
        setValue,
        control,
        formState: { errors },
    } = useFormContext();

    const upMd = useResponsive('up', 'md');

    const [openFrom, setOpenFrom] = useState(false);

    const handleOpenFrom = () => {
        setOpenFrom(true);
    };

    const handleCloseFrom = () => {
        setOpenFrom(false);
    };

    const handleAddPermission = (data) => {
        const arrObjPermission = permissions.filter((item) => data.includes(item.id));
        setValue('permissionId', arrObjPermission);
    };

    return (
        <Stack
            spacing={{ xs: 2, md: 5 }}
            direction={{ xs: 'column', md: 'row' }}
            divider={<Divider flexItem orientation={upMd ? 'vertical' : 'horizontal'} sx={{ borderStyle: 'dashed' }} />}
        >
            <Stack sx={{ width: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
                        Bao gồm những quyền:
                    </Typography>

                    <Button size="small" startIcon={<Iconify icon="eva:edit-fill" />} onClick={handleOpenFrom}>
                        Thêm/Thay đổi
                    </Button>

                    <PermissionListDialog
                        permissions={permissions}
                        selectedPermissions={selectedPermissions}
                        open={openFrom}
                        onClose={handleCloseFrom}
                        handleAddPermission={handleAddPermission}
                    />
                </Stack>
                {selectedPermissions?.length > 0 && (
                    <Panel>
                        {selectedPermissions.map((perm) => (
                            <Chip key={perm.id} label={perm.name} size="small" sx={{ m: 0.5 }} />
                        ))}
                    </Panel>
                )}
            </Stack>
        </Stack>
    );
}

// ----------------------------------------------------------------------

Panel.propTypes = {
    sx: PropTypes.object,
    label: PropTypes.string,
    children: PropTypes.node,
};

function Panel({ label, children, sx }) {
    return (
        <Stack
            direction="row"
            alignItems="stretch"
            sx={{
                m: 0.5,
                borderRadius: 1,
                overflow: 'hidden',
                border: (theme) => `solid 1px ${theme.palette.divider}`,
                ...sx,
            }}
        >
            <Stack
                component="span"
                direction="row"
                alignItems="center"
                sx={{
                    px: 1,
                    typography: 'subtitle2',
                    color: 'text.secondary',
                    bgcolor: 'background.neutral',
                    borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
            >
                {label}
            </Stack>

            <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
                {children}
            </Stack>
        </Stack>
    );
}
