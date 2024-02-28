import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
// @mui
import { Stack, Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { SingleFilePreview, Upload } from '../../../../components/upload';
import FormProvider from "../../../../components/hook-form";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createManyUser } from "../../../../dataProvider/agent";
import { useSnackbar } from "../../../../components/snackbar";
import { LoadingButton } from "@mui/lab";

// ----------------------------------------------------------------------

FileNewUserDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    onCreate: PropTypes.func,
    onUpdate: PropTypes.func,
    folderName: PropTypes.string,
    onChangeFolderName: PropTypes.func,
};

export default function FileNewUserDialog({
    title = 'Tải lên danh sách người dùng',
    open,
    onClose,
    //
    onCreate,
    onUpdate,
    //
    folderName,
    onChangeFolderName,
    ...other
}) {


    const validationSchema = Yup.object().shape({
    })

    const defaultValues = useMemo(
        () => ({

        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const formDataFileUser = new FormData();
    const [files, setFiles] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        if (!open) {
            setFiles([]);
        }
    }, [open]);

    const handleDrop = (acceptedFiles) => {
        try {
            setValue(`file`, acceptedFiles[0]);
            setFiles(acceptedFiles[0]);
        } catch (error) {
            console.error('handleDrop', error);
        }
    };

    const handleRemoveFile = () => {
        setValue(`file`, '');
        setFiles('');

    };

    const onSubmit = async (data) => {
        try {
            if (data.file == undefined) {
                return enqueueSnackbar(`Bạn chưa thêm file danh sách!`, { variant: 'error' });
            }
            formDataFileUser.append('file', data.file);
            const res = await createManyUser(formDataFileUser)
            if (res.status < 400) {
                enqueueSnackbar('Thêm danh sách người dùng thành công');
                onClose();
            } else {
                enqueueSnackbar(`${res.response.data.title}`, { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar(`Đã có lỗi xảy ra!`, { variant: 'error' });
        }
    };



    const handleRemoveAllFiles = () => {
        setFiles([]);
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
            <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
                    {(onCreate || onUpdate) && (
                        <TextField fullWidth label="Folder name" value={folderName} onChange={onChangeFolderName} sx={{ mb: 3 }} />
                    )}
                    <Upload
                        onCLick={() => {
                            console.log('upload');
                        }}
                        hasDefault
                        defaultFile={window.location.origin + '/assets/images/subjects/ImportManyUser.xlsx'}
                        accept={{ '.xlsx': [] }}
                        multiple
                        name={`file`}
                        error={getValues(`file`) === ''}
                        files={
                            getValues(`file`)
                                ? [
                                    Object.assign(getValues(`file`), {
                                        preview: URL.createObjectURL(Object.assign(getValues(`file`))),
                                    }),
                                ]
                                : []
                        }
                        handleDrop={handleDrop}
                        onRemove={handleRemoveFile}
                    />
                </DialogContent>

                <DialogActions>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Tải lên
                    </LoadingButton>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}
