import React from 'react';

import Biology from '../../public/assets/images/subjectlist/Biology.png';
import ComputerScience from '../../public/assets/images/subjectlist/ComputerScience.png';
import English from '../../public/assets/images/subjectlist/English.png';
import Geography from '../../public/assets/images/subjectlist/Geography.png';
import History from '../../public/assets/images/subjectlist/History.png';
import Maths from '../../public/assets/images/subjectlist/Maths.png';
import Music from '../../public/assets/images/subjectlist/Music.png';
import Physics from '../../public/assets/images/subjectlist/Physics.png';
import Science from '../../public/assets/images/subjectlist/Science.png';

import { Box, Image } from '@mui/material';
import { fileThumb } from '../components/file-thumbnail';

const SubjectImage = ({ subject, width, height }) => {
  switch (subject) {
    case 'Toán học': {
      return <img src={Maths} style={{ maxWidth: width, maxHeight: height }} alt="Maths" />;
    }
    case 'Ngữ văn': {
      return <img src={Geography} style={{ maxWidth: width, maxHeight: height }} alt="Geography" />;
    }
    case 'Sinh học': {
      return <img src={Biology} style={{ maxWidth: width, maxHeight: height }} alt="Biology" />;
    }
    case 'Vật lý': {
      return <img src={Physics} style={{ maxWidth: width, maxHeight: height }} alt="Physical" />;
    }
    case 'Hóa học': {
      return <img src={Science} style={{ maxWidth: width, maxHeight: height }} alt="Chemistry" />;
    }
    case 'Địa lý': {
      return <img src={Geography} style={{ maxWidth: width, maxHeight: height }} alt="Geography" />;
    }
    case 'Lịch sử': {
      return <img src={History} style={{ maxWidth: width, maxHeight: height }} alt="History" />;
    }
    case 'Tiếng Anh': {
      return <img src={English} style={{ maxWidth: width, maxHeight: height }} alt="English" />;
    }
    case 'Tin học': {
      return <img src={ComputerScience} style={{ maxWidth: width, maxHeight: height }} alt="MsOffice" />;
    }
    default:
      return '';
  }
};

export default SubjectImage;
