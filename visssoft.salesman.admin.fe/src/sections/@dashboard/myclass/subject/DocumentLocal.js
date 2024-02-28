import React from 'react';
import PropTypes from 'prop-types';
// @mui
import {Card, Typography, Stack, Avatar, Box, Button} from '@mui/material';

import useResponsive from '../../../../hooks/useResponsive';
// components
import Iconify from '../../../../components/iconify';

// utils
import { fData } from '../../../../utils/formatNumber';

const GB = 1000000000 * 24;

const data = [
  {
    name: 'Images',
    usedStorage: GB / 2,
    filesCount: 223,
    icon: <Box component="img" src="/assets/icons/files/ic_img.svg" />,
  },
  {
    name: 'Media',
    usedStorage: GB / 5,
    filesCount: 223,
    icon: <Box component="img" src="/assets/icons/files/ic_video.svg" />,
  },
  {
    name: 'Documents',
    usedStorage: GB / 5,
    filesCount: 223,
    icon: <Box component="img" src="/assets/icons/files/ic_document.svg" />,
  },
  {
    name: 'Other',
    usedStorage: GB / 10,
    filesCount: 223,
    icon: <Iconify icon="eva:file-fill" width={24} sx={{ color: 'text.disabled' }} />,
  },
];

export default function DocumentLocal({ docs }) {
  const isDesktop = useResponsive('up', 'sm');

  return (
    <Card sx={{ p: 3, cursor: 'pointer' }}>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography sx={{ mb: 2 }} variant="h5">
          Tài liệu chung
        </Typography>

        <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />}>
          Thêm tài liệu chung
        </Button>
      </Stack>
      <Stack spacing={2}>
        {docs?.map((doc) =>
          doc.slotId === null ? (
            <Stack key={doc.code} spacing={2} direction="row" alignItems="center">
              <Avatar
                variant="rounded"
                sx={{ bgcolor: 'background.neutral', width: 48, height: 48, borderRadius: 1.5 }}
              >
                <Box component="img" src="/assets/icons/files/ic_img.svg" />
              </Avatar>

              <Stack spacing={0.5} flexGrow={1}>
                <Typography variant="subtitle2"> {doc.name} </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  Loại file: {doc.typeFile}
                </Typography>
              </Stack>

              <Typography variant="subtitle2"> {fData(doc.size)} </Typography>
            </Stack>
          ) : (
            <div></div>
          )
        )}
      </Stack>
    </Card>
  );
}
