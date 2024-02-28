import PropTypes from 'prop-types';
import React, { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { format } from 'date-fns'
import SubjectAddTypeDocsDialog from '../../../../sections/@dashboard/typeDocs/list/SubjectAddTypeDocsDialog';

// ----------------------------------------------------------------------

TypeDocsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  typeId: PropTypes.string,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onAddTypeToSubject: PropTypes.func,
  onRemoveTypeFromSubject: PropTypes.func,
  onSelectRow: PropTypes.func,
  moreAction: PropTypes.bool,
};

export default function TypeDocsTableRow({ row, selected,typeId, onEditRow, onSelectRow,onAddTypeToSubject, onRemoveTypeFromSubject, onDeleteRow, moreAction }) {
  const { id, name, createDate } = row;


  const [openConfirm, setOpenConfirm] = useState(false);

  const [openConfirmRemoveTypeDocs, setOpenConfirmRemoveTypeDocs] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const [openAddOrRemoveTypeDocs, setOpenAddOrRemoveTypeDocs] = useState(false);


  const handleOpenAddTypeDocs = () => {
    setOpenAddOrRemoveTypeDocs(true);
  };


  const handleCloseAddTypeDocs = () => {
    setOpenAddOrRemoveTypeDocs(false);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenConfirmRemoveTypeDocs = () => {
    setOpenConfirmRemoveTypeDocs(true);
  };

  const handleCloseConfirmRemoveTypeDocs = () => {
    setOpenConfirmRemoveTypeDocs(false);
  };

  const handleOpenPopover = (event) => {
    console.log('typeId',typeId)
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  console.log('moreAction',moreAction)
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">

        </TableCell>

        <TableCell align="left">{name}</TableCell>

        <TableCell align="left">{new Date(createDate).toLocaleDateString()}</TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 200 }}>
        {moreAction && (
            <>


        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Cập nhật
        </MenuItem>
        <MenuItem
            onClick={handleOpenAddTypeDocs}
        >
          <Iconify icon="eva:plus-outline" />
          Thêm vào môn học
        </MenuItem>
        <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Xóa
        </MenuItem>
            </>
        )}
        {!moreAction && (
        <MenuItem
            onClick={() => {
              handleOpenConfirmRemoveTypeDocs();
              handleClosePopover();
            }}
        >
          <Iconify icon="eva:close-outline" />
          Gỡ khỏi môn học
        </MenuItem>
        )}
      </MenuPopover>
      <SubjectAddTypeDocsDialog typeDocsId={typeId} open={openAddOrRemoveTypeDocs} onClose={handleCloseAddTypeDocs} />
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Xóa loại tài liệu"
        content="Bạn có chắc chắn muốn xóa?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xóa
          </Button>
        }
      />
      <ConfirmDialog
          open={openConfirmRemoveTypeDocs}
          onClose={handleCloseConfirmRemoveTypeDocs}
          title="Gỡ loại tài liệu"
          content="Bạn có chắc chắn muốn gỡ loại tài liệu khỏi môn học này?"
          action={
            <Button variant="contained" color="error" onClick={onRemoveTypeFromSubject}>
              Xóa
            </Button>
          }
      />
    </>
  );
}
