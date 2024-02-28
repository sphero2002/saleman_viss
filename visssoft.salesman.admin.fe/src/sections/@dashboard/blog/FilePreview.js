import PropTypes from 'prop-types';
// @mui
import { LoadingButton } from '@mui/lab';
import { alpha } from '@mui/material/styles';
import { Box, Button, Container, Typography, DialogActions, Dialog, Divider } from '@mui/material';
// components
import Image from '../../../components/image';
import Markdown from '../../../components/markdown';
import Scrollbar from '../../../components/scrollbar';
import FileViewer from 'react-file-viewer';
import EmptyContent from '../../../components/empty-content';

// ----------------------------------------------------------------------

FilePreview.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
};

export default function FilePreview({ open, onClose }) {

    const file = ''
    const type = 'png'


    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <DialogActions sx={{ py: 2, px: 3 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Preview
                </Typography>

                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancel
                </Button>

                <LoadingButton type="submit" variant="contained">
                    Post
                </LoadingButton>
            </DialogActions>

            <Divider />
            <Scrollbar>
                <Container sx={{ mt: 5, mb: 10 }}>
                    <div id={"second"}>
                        <iframe
                            title={'PDF-Viewer'}
                            src={window.location.origin + `/assets/images/subjects/test.pdf`}
                            frameBorder={0}
                            style={{ height: '50vh', width: '50vw' }}>
                        </iframe>
                    </div>

                </Container>
            </Scrollbar>
        </Dialog>
    );
}


