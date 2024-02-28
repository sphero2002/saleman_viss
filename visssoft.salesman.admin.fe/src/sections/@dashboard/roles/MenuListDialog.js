import PropTypes, { any } from 'prop-types';
// @mui
import { Box, Button, Card, Checkbox, Dialog, Divider, FormControlLabel, Stack, Typography } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import { useState } from 'react';
import { useEffect } from 'react';
import Scrollbar from "../../../components/scrollbar";

// ----------------------------------------------------------------------

MenuListDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    data: any,
};

export default function MenuListDialog({ selectedMenuItems, menuItems, onClose, open, handleAddMenuItems }) {
    const [selectedMenuItem, setSelectedMenuItem] = useState([]);

    const handleSelectMenuItems = (e) => {
        const { value, checked } = e.target;

        console.log(`${value} is ${checked}`);

        if (checked) {
            setSelectedMenuItem((prev) => [...prev, parseInt(value)]);
        } else {
            setSelectedMenuItem((prev) => prev.filter((item) => item !== parseInt(value)));
        }
    };

    const onAddMenuItems = () => {
        handleAddMenuItems(selectedMenuItem);
        setSelectedMenuItem([]);
        onClose();
    };

    useEffect(() => {
        if (selectedMenuItems?.length > 0) {
            setSelectedMenuItem(selectedMenuItems.map((item) => item.id));
        }
    }, [selectedMenuItems]);

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                <Typography variant="h6"> Chọn quyền truy cập danh mục cho vai trò </Typography>

                <Button
                    size="small"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={onAddMenuItems}
                    sx={{ alignSelf: 'flex-end' }}
                >
                    {selectedMenuItems?.length > 0 ? 'Thay đổi' : 'Thêm'}
                </Button>
            </Stack>
            <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
                <Card sx={{ p: 2.5, px: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                        {menuItems?.map((menu) => (
                            <FormControlLabel
                                label={`${menu.subheader} / ${menu.title} `}
                                control={
                                    <Checkbox
                                        value={menu.id}
                                        defaultChecked={selectedMenuItems.map((item) => item.id).includes(menu.id)}
                                        onChange={handleSelectMenuItems}
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
