import PropTypes, { any } from 'prop-types';
// @mui
import { Box, Button, Card, Checkbox, Dialog, Divider, FormControlLabel, Stack, Typography } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import { useState } from 'react';
import { useEffect } from 'react';
import Scrollbar from "../../../components/scrollbar";

// ----------------------------------------------------------------------

PermissionListDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    data: any,
};

export default function PermissionListDialog({ selectedPermissions, permissions, onClose, open, handleAddPermission }) {
    console.log(permissions)
    const [selectedPermission, setSelectedPermission] = useState([]);

    const handleSelectPermissions = (e) => {
        const { value, checked } = e.target;

        console.log(`${value} is ${checked}`);

        if (checked) {
            setSelectedPermission((prev) => [...prev, parseInt(value)]);
        } else {
            setSelectedPermission((prev) => prev.filter((item) => item !== parseInt(value)));
        }
    };

    const onAddPermission = () => {
        handleAddPermission(selectedPermission);
        setSelectedPermission([]);
        onClose();
    };

    useEffect(() => {
        if (selectedPermissions?.length > 0) {
            setSelectedPermission(selectedPermissions.map((item) => item.id));
        }
    }, [selectedPermissions]);

    return (
        <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                <Typography variant="h6"> Chọn quyền cho vai trò </Typography>

                <Button
                    size="small"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={onAddPermission}
                    sx={{ alignSelf: 'flex-end' }}
                >
                    {selectedPermissions?.length > 0 ? 'Thay đổi' : 'Thêm'}
                </Button>
            </Stack>
            <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
                <Card sx={{ p: 2.5, px: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                        {permissions?.map((perm) => (
                            <FormControlLabel
                                label={`${perm.name} ( ${perm.description} )`}
                                control={
                                    <Checkbox
                                        value={perm.id}
                                        defaultChecked={selectedPermissions.map((item) => item.id).includes(perm.id)}
                                        onChange={handleSelectPermissions}
                                    />
                                }
                            />
                        ))}
                    </Box>
                </Card>
            </Scrollbar>
        </Dialog>
    );
}
