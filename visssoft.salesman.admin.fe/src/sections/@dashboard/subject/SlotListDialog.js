import PropTypes, { any } from 'prop-types';
// @mui
import { Box, Button, Card, Checkbox, Dialog, Divider, FormControlLabel, Stack, Typography } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import { useState } from 'react';
import { useEffect } from 'react';
import Scrollbar from "../../../components/scrollbar";

// ----------------------------------------------------------------------

SlotListDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    data: any,
};

export default function SlotListDialog({ selectedSlots, slots, onClose, open, handleAddSlot }) {
    const [selectedSlot, setSelectedSlot] = useState([]);

    const handleSelectSlots = (e) => {
        const { value, checked } = e.target;

        console.log(`${value} is ${checked}`);

        if (checked) {
            setSelectedSlot((prev) => [...prev, parseInt(value)]);
        } else {
            setSelectedSlot((prev) => prev.filter((item) => item !== parseInt(value)));
        }
    };

    const onAddSlot = () => {
        handleAddSlot(selectedSlot);
        setSelectedSlot([]);
        onClose();
    };

    useEffect(() => {
        if (selectedSlots?.length > 0) {
            setSelectedSlot(selectedSlots.map((item) => item.id));
        }
    }, [selectedSlots]);

    return (
        <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                <Typography variant="h6"> Chọn tiết học </Typography>

                <Button
                    size="small"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={onAddSlot}
                    sx={{ alignSelf: 'flex-end' }}
                >
                    {selectedSlots?.length > 0 ? 'Thay đổi' : 'Thêm'}
                </Button>
            </Stack>
            <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
                <Card sx={{ p: 2.5, px: 3 }}>
                    {/* <FormControlLabel label="Tất cả" control={<Checkbox value={'tất cả'} onChange={handleSelectSlots} />} /> */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                        {slots?.map((slot) => (
                            <FormControlLabel
                                label={slot.name}
                                control={
                                    <Checkbox
                                        value={slot.id}
                                        defaultChecked={selectedSlots.map((item) => item.id).includes(slot.id)}
                                        onChange={handleSelectSlots}
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
