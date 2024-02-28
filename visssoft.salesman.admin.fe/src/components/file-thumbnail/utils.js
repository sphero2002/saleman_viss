// ----------------------------------------------------------------------

// Define more types here
const FORMAT_PDF = ['pdf'];
const FORMAT_TEXT = ['txt'];
const FORMAT_PHOTOSHOP = ['psd'];
const FORMAT_WORD = ['doc', 'docx'];
const FORMAT_EXCEL = ['xls', 'xlsx'];
const FORMAT_ZIP = ['zip', 'rar', 'iso'];
const FORMAT_ILLUSTRATOR = ['ai', 'esp'];
const FORMAT_POWERPOINT = ['ppt', 'pptx'];
const FORMAT_AUDIO = ['wav', 'aif', 'mp3', 'aac'];
const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg'];
const FORMAT_VIDEO = ['m4v', 'avi', 'mpg', 'mp4', 'webm'];

const iconUrl = (icon) => `/assets/icons/files/${icon}.svg`;

// ----------------------------------------------------------------------

export function fileFormat(fileUrl) {
  let format;

  switch (fileUrl?.includes(fileTypeByUrl(fileUrl))) {
    case FORMAT_TEXT.includes(fileTypeByUrl(fileUrl)):
      format = 'txt';
      break;
    case FORMAT_ZIP.includes(fileTypeByUrl(fileUrl)):
      format = 'zip';
      break;
    case FORMAT_AUDIO.includes(fileTypeByUrl(fileUrl)):
      format = 'audio';
      break;
    case FORMAT_IMG.includes(fileTypeByUrl(fileUrl)):
      format = 'image';
      break;
    case FORMAT_VIDEO.includes(fileTypeByUrl(fileUrl)):
      format = 'video';
      break;
    case FORMAT_WORD.includes(fileTypeByUrl(fileUrl)):
      format = 'word';
      break;
    case FORMAT_EXCEL.includes(fileTypeByUrl(fileUrl)):
      format = 'excel';
      break;
    case FORMAT_POWERPOINT.includes(fileTypeByUrl(fileUrl)):
      format = 'powerpoint';
      break;
    case FORMAT_PDF.includes(fileTypeByUrl(fileUrl)):
      format = 'pdf';
      break;
    case FORMAT_PHOTOSHOP.includes(fileTypeByUrl(fileUrl)):
      format = 'photoshop';
      break;
    case FORMAT_ILLUSTRATOR.includes(fileTypeByUrl(fileUrl)):
      format = 'illustrator';
      break;
    default:
      format = fileTypeByUrl(fileUrl);
  }

  return format;
}

// ----------------------------------------------------------------------

export function fileThumb(fileUrl) {
  let thumb;

  switch (fileFormat(fileUrl)) {
    case 'folder':
      thumb = iconUrl('ic_folder');
      break;
    case 'txt':
      thumb = iconUrl('ic_txt');
      break;
    case 'text/plain':
      thumb = iconUrl('ic_txt');
      break;
    case 'zip':
      thumb = iconUrl('ic_zip');
      break;
    case 'application/x-zip-compressed':
      thumb = iconUrl('ic_zip');
      break;
    case 'audio':
      thumb = iconUrl('ic_audio');
      break;
    case 'audio/mpeg':
      thumb = iconUrl('ic_audio');
      break;
    case 'video':
      thumb = iconUrl('ic_video');
      break;
    case 'video/mp4':
      thumb = iconUrl('ic_video');
      break;
    case 'word':
      thumb = iconUrl('ic_word');
      break;
    case 'document':
      thumb = iconUrl('ic_word');
      break;
    case 'excel':
      thumb = iconUrl('ic_excel');
      break;
    case 'sheet':
      thumb = iconUrl('ic_excel');
      break;
    case 'ms-excel':
      thumb = iconUrl('ic_excel');
      break;
    case 'powerpoint':
      thumb = iconUrl('ic_power_point');
      break;
    case 'pdf':
      thumb = iconUrl('ic_pdf');
      break;
    case 'application/pdf':
      thumb = iconUrl('ic_pdf');
      break;
    case 'photoshop':
      thumb = iconUrl('ic_pts');
      break;
    case 'illustrator':
      thumb = iconUrl('ic_ai');
      break;
    case 'image':
      thumb = iconUrl('ic_img');
      break;
    case 'image/png':
      thumb = iconUrl('ic_img');
      break;
    case 'image/jpeg':
      thumb = iconUrl('ic_img');
      break;
    default:
      thumb = iconUrl('ic_file');
  }
  return thumb;
}

export function imageSubject(codeSubject) {
  let imageURL;

  switch (codeSubject) {
    case 'AMNHAC':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/amnhac.png';
      break;
    case 'DAODUC':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/daoduc.png';
      break;
    case 'GDCD':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/gdcd.png';
      break;
    case 'THEDUC':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/theduc.png';
      break;
    case 'TRAINGHIEM':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/trainghiem.png';
      break;
    case 'KHOAHOC':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/khoahoc.png';
      break;
    case 'KHTN':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/khoahoctunhien.png';
      break;
    case 'LICHSUDIALY':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/lichsudialy.png';
      break;
    case 'MITHUAT':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/mythuat.png';
      break;
    case 'ANH1':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/ngoaingu1.jpg';
      break;
    case 'ANH2':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/ngoaingu1.png';
      break;
    case 'NGUVAN':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/nguvan.png';
      break;
    case 'TD1':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/theduc1.jpg';
      break;
    case 'TIENGDANTOC':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/dantoc.png';
      break;
    case 'TIENGVIET':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/tiengviet.jpg';
      break;
    case 'TINHOCCONGNGHE':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/tinhoc.png';
      break;
    case 'TOAN':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/toan.png';
      break;
    case 'TNXH':
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/tunhien.png';
      break;
    default:
      imageURL = 'http://lmms.site:7070/assets/images/subjectlists/chuaro.png';
  }
  return imageURL;
}

// ----------------------------------------------------------------------

export function fileTypeByUrl(fileUrl = '') {
  return (fileUrl && fileUrl.split('.').pop()) || '';
}

// ----------------------------------------------------------------------

export function fileNameByUrl(fileUrl) {
  return fileUrl.split('/').pop();
}

// ----------------------------------------------------------------------

export function fileData(file) {
  // Url
  if (typeof file === 'string') {
    return {
      key: file,
      preview: file,
      name: fileNameByUrl(file),
      type: fileTypeByUrl(file),
    };
  }

  // File
  return {
    key: file.preview,
    name: file.name,
    size: file.size,
    path: file.path,
    type: file.type,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
  };
}
