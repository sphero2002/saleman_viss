import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, Card, Stack, Button, Divider, MenuItem, Checkbox, IconButton } from '@mui/material';

// Date
import { format } from 'date-fns';

// components

import TextMaxLine from '../../../../components/text-max-line';

import { PATH_DASHBOARD } from 'src/routes/paths';
import { dispatch } from 'src/redux/store';
import { getFolderRedux } from 'src/redux/slices/folder';

// ----------------------------------------------------------------------

export default function FolderGeneralData({ data, selected, onSelect, folder, sx, ...other }) {
  console.log('FolderGeneralData: ', data);

  const handleOnClickFileFolderCard = async (pid) => {
    dispatch(getFolderRedux(pid, 'folderSaveDocToMyFolder'));
  };

  return (
    <>
      <Card
        sx={{
          p: 2.5,

          boxShadow: 0,
          bgcolor: 'background.default',
          '&:hover': {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
            cursor: 'pointer',
          },
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          ...(selected && {
            borderColor: 'transparent',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Stack
          onClick={() => handleOnClickFileFolderCard(folder.id)}
          sx={{ display: 'flex', alignItems: ' center', flexDirection: 'row' }}
        >
          <Box component="img" src="/assets/icons/files/ic_folder.svg" sx={{ width: 60, height: 60, mr: 3 }} />
          <Box>
            <TextMaxLine variant="h6" sx={{ mt: 1 }}>
              {folder.name}
            </TextMaxLine>
            <span>{`Ngày tạo: `}{format(new Date(folder.createDate), 'dd/MM/yyyy')}</span>
          </Box>
          <Box></Box>
        </Stack>

        <Stack
          onClick={() => handleOnClickFileFolderCard(folder.id)}
          sx={{ display: 'flex', alignItems: ' center', flexDirection: 'row' }}
        ></Stack>
      </Card>
    </>
  );
}
