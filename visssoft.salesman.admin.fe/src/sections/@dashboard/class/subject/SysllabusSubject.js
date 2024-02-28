import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Card,
  Button,
  Typography,
  Stack,
  Divider,
  MenuItem,
  AvatarGroup,
  Checkbox,
  IconButton,
  Alert,
  Grid,
} from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import DocumentPreview from '../../documents/DocumentPreview';
// DATE
import { format } from 'date-fns';
import UploadDocToSlot from '../../myclass/popupdiaglog/UploadDocToSlot';
import FileThumbnail, { fileFormat } from '../../../../components/file-thumbnail';
import { ROLES_CODE, URL_GLOBAL } from '../../../../config';
import { FileDetailsDrawer } from '../../file';
import useResponsive from '../../../../hooks/useResponsive';
import { dispatch } from '../../../../redux/store';
import { startDownloadFileRedux } from '../../../../redux/slices/document';
import { FileGeneralRecentCard } from '../../general/file';
import { useSelector } from 'react-redux';
import { useAuthContext } from '../../../../auth/useAuthContext';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import EmptyContent from '../../../../components/empty-content';
import { getClassById } from '../../../../dataProvider/agent';
import { useRouter } from 'next/router';

export default function SysllabusSubject({
  data,
  document,
  classId,
  subjectId,
  documentInClass,
  handleOpenFormUploadDocToSlot,
}) {
  const router = useRouter();
  const { action } = router.query;
  console.log('action', action);
  const isDesktop = useResponsive('up', 'sm');
  const { createBy, createDate, id, isDeleted, name, updateBy, updateDate } = document;
  const [openPreview, setOpenPreview] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const { user } = useAuthContext();
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            {name}
          </Typography>
          {action === 'true' ? (
            <Button
              size="small"
              onClick={() => handleOpenFormUploadDocToSlot(id)}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Thêm tài liệu
            </Button>
          ) : (
            <></>
          )}
        </Stack>

        <Stack spacing={3}>
          <Stack key={''} spacing={1}>
            {documentInClass?.map((doc, index) =>
              doc?.slotId === id ? (
                doc ? (
                  <Stack key={doc.id} spacing={2}>
                    <FileGeneralRecentCard
                      data={{ ...data, slotId: id, index: index }}
                      file={doc}
                      onDelete={() => console.log('DELETE', doc.id)}
                    />
                  </Stack>
                ) : (
                  <Stack alignItems="center" justifyContent="center">
                    <Alert severity="info">Chưa có tài liệu cho tiết học này</Alert>
                  </Stack>
                )
              ) : (
                ''
              )
            )}
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
