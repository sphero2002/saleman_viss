import PropTypes from 'prop-types';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Container, Dialog, DialogActions, DialogContent, Divider, Typography } from '@mui/material';
// components
import Scrollbar from '../../../components/scrollbar';
import { useEffect, useState } from 'react';
import { getDocumentById, getGradeById } from '../../../dataProvider/agent';

// ----------------------------------------------------------------------

DocumentPreview.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    document: PropTypes.any,
};

export default function DocumentPreview({ open, onClose, document }) {
    const [documentData, setDocumentData] = useState([]);
    useEffect(() => {
        fetchDocument();
    }, []);

    async function fetchDocument() {
        const res = await getDocumentById(document);
        if (res.status < 400) {
            setDocumentData(res.data.data);
        } else {
            console.log('error');
        }
    }

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <DialogActions sx={{ py: 2, px: 3 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Chế độ xem trước
                </Typography>

                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Quay lại
                </Button>
            </DialogActions>

            <Divider />
            <Container maxWidth={'xl'}>
                <Scrollbar>
                    <Container sx={{ mt: 5 }}>
                        <div id={'second'}>
                            <iframe
                                title={`${documentData.name}`}
                                src={window.location.origin + `/${documentData.urlDocument}`}
                                style={{ height: '48vh', width: '41vw' }}
                            ></iframe>
                        </div>
                    </Container>
                </Scrollbar>
            </Container>
        </Dialog>
    );
}
