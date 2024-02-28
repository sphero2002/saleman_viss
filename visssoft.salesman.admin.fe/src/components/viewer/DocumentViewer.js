import React from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import VideoPlayer from './VideoPlayer';
import PdfViewer from './PdfViewer';

const DocumentViewer = ({ fileUrl }) => {
    const extension = fileUrl.split('.').pop();
    const fileTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'png', 'gif', 'jpg', 'jpeg', 'mp4', 'webm', 'ogg', 'txt'];
    const type = fileTypes.includes(extension) ? extension : 'unknown';

    const filename = fileUrl.split('/').pop().split('#')[0].split('?')[0];
    //const url = new URL(fileUrl);
    //console.log(url.pathname);
    //var path = "./uploads/1672867223_ImportSubjectClass.xlsx";// url.pathname;
    //console.log('url.pathname', encodeURIComponent(url.pathname));
    //fileUrl = 'https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pptx';
    //const urlData = !!path ? [{ uri: path, fileType: 'docx' }] : []; encodeURIComponent
    const docs = [
        { uri: fileUrl, fileType: type },
    ];

    switch (type) {
        case 'pdf':
            return (
                <PdfViewer file={fileUrl} />
            );
        case 'txt':
        case 'doc':
        case 'docx':
        case 'ppt':
        case 'pptx':
        case 'xls':
        case 'xlsx':
            return (
                <center >
                    <iframe
                        title={filename}
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
                        frameBorder={0}
                        style={{ height: '100vh', width: '90vw' }}>
                    </iframe>
                    {/*<DocViewer*/}
                    {/*    pluginRenderers={DocViewerRenderers}*/}
                    {/*    documents={docs}*/}
                    {/*    config={{*/}
                    {/*        header: {*/}
                    {/*            disableHeader: false,*/}
                    {/*            disableFileName: false,*/}
                    {/*            retainURLParams: false*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*    style={{ height: 1000 }}*/}
                    {/*/> */}
                </center >
            );
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return (
                <center>
                    <div>
                        <img src={fileUrl} alt="document" />
                    </div>
                </center>
            );
        case 'mp4':
        case 'webm':
        case 'ogg':
            return (
                <center >
                    <div>
                        <VideoPlayer src={url} alt="video" />
                    </div>
                </center >
            );
        default:
            return <div>Unsupported file type.</div>;
    }
};

export default DocumentViewer;