import PropTypes from 'prop-types';
// @mui
import { Link, Button, Divider, Typography, Stack } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { DialogAnimate } from '../../../../components/animate';
// assets
import { OrderCompleteIllustration } from '../../../../assets/illustrations';
import {dispatch} from "../../../../redux/store";
import {resetAddClass} from "../../../../redux/slices/class";

// ----------------------------------------------------------------------

ClassAddComplete.propTypes = {
  open: PropTypes.bool,
  onReset: PropTypes.func,
};

export default function ClassAddComplete({ open, onReset }) {
    const handleResetSteps = () => {
        onReset();
    }

  return (
    <DialogAnimate
      fullScreen
      open={open}
      PaperProps={{
        sx: {
          maxWidth: { md: 'calc(100% - 48px)' },
          maxHeight: { md: 'calc(100% - 48px)' },
        },
      }}
    >
      <Stack
        spacing={5}
        sx={{
          m: 'auto',
          maxWidth: 480,
          textAlign: 'center',
          px: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4">Hoàn thành tạo lớp học!</Typography>

        <OrderCompleteIllustration sx={{ height: 260 }} />


        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack spacing={2} justifyContent="space-between" direction={{ xs: 'column-reverse', sm: 'row' }}>
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            onClick={handleResetSteps}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Trở về
          </Button>
        </Stack>
      </Stack>
    </DialogAnimate>
  );
}
