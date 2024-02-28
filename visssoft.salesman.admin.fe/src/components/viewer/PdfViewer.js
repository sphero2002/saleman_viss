import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { Button } from '@mui/material'; 
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ file }) => {
    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(1.1);

    const handleZoomIn = () => {
        setScale(scale + 0.2);
    };

    const handleZoomOut = () => {
        setScale(scale - 0.2);
    };

    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setNumPages(nextNumPages);
    }

    return (
        <center>
            <div>
                <div>
                    <button onClick={handleZoomIn} disabled={scale >= 3}>
                        Zoom +
                    </button>
                    <button onClick={handleZoomOut} disabled={scale <= 0.3}>
                        Zoom -
                    </button>
                </div>
                <div>
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.error} httpHeaders={{ "Access-Control-Allow-Origin": "*" }} options={{ workerSrc: "pdf.worker.js" }}>
                        {Array.from({ length: numPages }, (_, index) => (
                            <Page
                                scale={scale}
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                            />
                        ))}
                    </Document>
                </div>
            </div>
        </center>
    );
};

export default PdfViewer;