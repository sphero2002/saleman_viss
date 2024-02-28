import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Card, Typography, MenuItem, IconButton } from '@mui/material';
// utils
// components
import Iconify from '../../../../components/iconify';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';
import MenuPopover from '../../../../components/menu-popover';
import { Stack } from '@mui/system';
// ----------------------------------------------------------------------

ClassBanner.propTypes = {
  sx: PropTypes.object,
  data: PropTypes.object,
};

const colors = ['primary', 'info', 'warning'];

export default function ClassBanner({
  data,
  color = data ? colors[Math.floor((data.gradeId - 1) / 5)] : 'primary',
  sx,
  ...other
}) {
  const router = useRouter();
  const theme = useTheme();

  const [openPopover, setOpenPopover] = useState(null);
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handleClassDetails = useCallback((class_id) => {
    router.push(PATH_DASHBOARD.myclass.classdetail(class_id));
  }, []);
  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        cursor: 'pointer',
        ':hover': {
          boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
          transition: 'transform 150ms',
          transform: 'translateY(-10px)',
        },
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
        <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
        <MenuItem
        // onClick={() => {
        //   handleClosePopover();
        //   handleCopy();
        // }}
        >
          <Iconify icon="eva:link-2-fill" />
          Edit
        </MenuItem>

        {/* <MenuItem
        onClick={() => {
          handleClosePopover();
          handleOpenShare();
        }}
        >
          <Iconify icon="eva:share-fill" />
          Share
        </MenuItem> */}

        {/* <MenuItem
          onClick={() => {
            handleClosePopover();
            handleOpenEditFolder();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem> */}
      </MenuPopover>
      <Typography onClick={() => handleClassDetails(data.id)} variant="h3">
        {data ? data.name : 'Undefined'}
      </Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
        {data ? data.schoolYear : 'Undefined'}
      </Typography>
    </Card>
  );
}
