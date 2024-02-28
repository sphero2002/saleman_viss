import React, { useState } from 'react';
// @mui
import { Box, Button, Card, Stack, Typography } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
// import MenuPopover from '../../../../components/menu-popover';
// import DocumentPreview from '../../documents/DocumentPreview';
// UPLOAD STORAGE
import UploadDocToSlot from '../popupdiaglog/UploadDocToSlot'; // DATE
import { format } from 'date-fns';

export default function SysllabusSubject({ data, classId, subjectId, docs }) {
  const { createBy, createDate, id, isDeleted, name, updateBy, updateDate } = data;

  const [openFrom, setOpenFrom] = useState(false);

  const handleOpenFrom = () => {
    setOpenFrom(true);
  };

  const handleCloseFrom = () => {
    setOpenFrom(false);
  };

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {name}
          </Typography>

          <Button size="small" onClick={handleOpenFrom} startIcon={<Iconify icon="eva:plus-fill" />}>
            Thêm tài liệu
          </Button>
        </Stack>
        {/* Upload doc to slot */}
        <UploadDocToSlot
          classId={classId}
          subjectId={subjectId}
          slotId={id}
          open={openFrom}
          onClose={handleCloseFrom}
        />

        <Stack spacing={3}>
          <Stack key={''} spacing={1}>
            <Typography variant="body2">
              <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
                Date:
              </Box>
              {format(new Date(createDate), 'dd MMM yyyy')}
            </Typography>

            {docs?.map((doc) =>
              doc?.slotId === id ? (
                <Box variant="body2" sx={{ display: 'flex' }}>
                  <Box component="img" src="/assets/icons/files/ic_document.svg" sx={{ ml: 1 }} />
                  <Button variant="text">{doc.name}</Button>
                </Box>
              ) : (
                ''
              )
            )}

            {/* <Stack direction="row" spacing={1}>
              <Button color="error" size="small" startIcon={<Iconify icon="eva:trash-2-outline" />}>
                Delete
              </Button>

              <Button size="small" startIcon={<Iconify icon="eva:edit-fill" />}>
                Edit
              </Button>
            </Stack> */}
          </Stack>
        </Stack>
      </Card>
      {/* <DocumentPreview open={openPreview} onClose={handleClosePreview} /> */}
    </>
  );
}
