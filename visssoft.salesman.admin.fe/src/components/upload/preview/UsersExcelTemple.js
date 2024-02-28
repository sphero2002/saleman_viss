import PropTypes from 'prop-types';
import {AnimatePresence} from 'framer-motion';
// @mui
import {Stack, Typography} from '@mui/material';
// utils
import {fData} from '../../../utils/formatNumber';
//
import FileThumbnail from '../../file-thumbnail';
import {useRouter} from "next/router";

// ----------------------------------------------------------------------

UsersExcelTemple.propTypes = {
    sx: PropTypes.object,
    files: PropTypes.array,
};

export default function UsersExcelTemple({files, sx}) {

    const { push } = useRouter();

    const handleDownloadTemple = () => {
        push(files);
    };

    return (
        <AnimatePresence initial={false}>
            <Stack
                spacing={2}
                direction="row"
                alignItems="center"
                sx={{
                    cursor : "pointer",
                    my: 1,
                    px: 1,
                    py: 0.75,
                    borderRadius: 0.75,
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                    ...sx,
                }}
                onClick={handleDownloadTemple}
            >
                <FileThumbnail file={files}/>
                <Stack flexGrow={1} sx={{minWidth: 0}}>
                    <Typography variant="subtitle2" noWrap>
                        Danh sách mẫu.xlsx
                    </Typography>
                    <Typography variant="caption" sx={{color: 'text.secondary'}}>
                        {fData(9000)}
                    </Typography>
                </Stack>
            </Stack>
        </AnimatePresence>
    );
}
