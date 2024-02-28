import React, { useState } from 'react';
// COMPONENT
import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { dispatch } from '../../../../redux/store';
import { GeneralFilePage } from '../../folder';
import { copyDocsToFolderRedux, getFolderRedux } from 'src/redux/slices/folder';
import { postDocumentsInSlotRedux } from 'src/redux/slices/subject';
import { useSnackbar } from 'notistack';

UploadDocToSlotxx.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  slotId: PropTypes.number,
};
export default function UploadDocToSlotxx({ open, onClose, slotId, classId, subjectId }) {
  const { folderUploadDocToSlot, folderUploadDocToSlotInGeneralFolder } = useSelector((state) => state.folder);
  const { enqueueSnackbar } = useSnackbar();

  const [currentTab, setCurrentTab] = useState(0);

  const handleAddDocumentToSlot = async (documentId) => {
    console.log('postData', classId, documentId, slotId, subjectId);

    const message = await dispatch(postDocumentsInSlotRedux(classId, documentId, slotId, subjectId));
    if (message) {
      enqueueSnackbar(message.title, { variant: message.variant });
    }
  };

  const tabs = [
    {
      id: 0,
      value: 'myDocument',
      label: `Tài liệu của tôi`,
      component: (
        <GeneralFilePage
          data={{
            handleAddDocumentToSlot,
            onClose: onClose,
            ...folderUploadDocToSlot,
            archiveFolderId: folderUploadDocToSlot.id,
            handleBackPage: () => {
              dispatch(getFolderRedux(folderUploadDocToSlot.parentId, 'folderUploadDocToSlot'));
            },
            types: ['folderUploadDocToSlot'],
            menuSubFolder: [],
            menuDocument: [],
            panel: ['popupUploadDocToSlot'],
            slotId: slotId,
            classId: classId,
            subjectId: subjectId,
          }}
        />
      ),
      // component: component,
    },

    {
      id: 1,
      value: 'generalDocument',
      label: `Kho tài liệu chung`,
      component: (
        <GeneralFilePage
          data={{
            handleAddDocumentToSlot,
            onClose: onClose,
            ...folderUploadDocToSlotInGeneralFolder,
            archiveFolderId: folderUploadDocToSlotInGeneralFolder.id,
            handleBackPage: () => {
              dispatch(
                getFolderRedux(folderUploadDocToSlotInGeneralFolder.parentId, 'folderUploadDocToSlotInGeneralFolder')
              );
            },
            types: ['folderUploadDocToSlotInGeneralFolder'],
            menuSubFolder: [],
            menuDocument: [],
            panel: ['popupUploadDocToSlot'],
            slotId: slotId,
            classId: classId,
            subjectId: subjectId,
          }}
        />
      ),
      // component: component,
    },
  ];

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Đăng tải tài liệu của tôi
        </Typography>

        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            onClose();
          }}
        >
          Quay lại
        </Button>
      </DialogActions>

      <Divider />
      <Container maxWidth={'xl'}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            console.log('onChange', newValue);
            setCurrentTab(newValue);
            //   setComponentTab(tabs[newValue].component);
          }}
          sx={{ px: 3, bgcolor: 'background.neutral' }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} value={tab.id} label={tab.label} />
          ))}
        </Tabs>

        <Divider />

        {tabs.map(
          (tab) =>
            tab.id === currentTab && (
              <Box
                key={tab.id}
                sx={{
                  ...(currentTab === 'description' && {
                    p: 3,
                  }),
                }}
              >
                {tab.component}
              </Box>
            )
        )}
        <Divider />
      </Container>
    </Dialog>
  );
}
