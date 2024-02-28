import React from 'react';
import { Grid, Button, Box } from '@mui/material';
import { CLassDetails, ClassTeacher } from '../../myclass';
import { _subjects, _subjectNew, _subjectsOverview, _subjectReview } from '../../../../_mock/arrays';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Iconify from '../../../../components/iconify';

export default function ManageUser({ myClass }) {
  console.log('my class: ', myClass);
  const {
    query: { myclass_id },
  } = useRouter();
  const { push } = useRouter();

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CLassDetails
            title="Thông tin học sinh"
            myClass={myClass}
            tableData={_subjects}
            tableLabels={[
              { id: 'STT', label: 'STT' },
              { id: 'name', label: 'Họ và tên' },
              { id: 'birthDate', label: 'Ngày sinh' },
              { id: 'email', label: 'E-mail' },
              { id: 'gender', label: 'Giới tính' },
              { id: '' },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <ClassTeacher
            title="Thông tin giáo viên"
            myClass={myClass}
            tableData={_subjects}
            tableLabels={[
              { id: 'STT', label: 'STT' },
              { id: 'name', label: 'Họ và tên' },
              { id: 'Subject', label: 'Môn dạy' },
              { id: 'email', label: 'E-mail' },
              { id: 'gender', label: 'Giới tính' },
              { id: '' },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
}
