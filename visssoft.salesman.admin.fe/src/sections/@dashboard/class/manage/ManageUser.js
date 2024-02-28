import React from 'react';
import { Grid, Button, Box } from '@mui/material';
import { CLassDetails, ClassTeacher } from '../../class';
import { _subjects, _subjectNew, _subjectsOverview, _subjectReview } from '../../../../_mock/arrays';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Iconify from '../../../../components/iconify';

export default function ManageUser({ fetchMyClass, classID, myClass, user }) {
  const {
    query: { myclass_id },
  } = useRouter();
  const { push } = useRouter();

  return (
    <>
      <Grid sx={{ mt: 1 }} container spacing={3}>
        <Grid item xs={12}>
          <ClassTeacher
            fetchMyClass={() => fetchMyClass()}
            title="Thông tin giáo viên"
            myClass={myClass}
            classID={classID}
            user={user}
            tableLabels={[
              { id: 'STT', label: 'Ảnh' },
              { id: 'name', label: 'Họ và tên' },
              { id: 'role', label: 'Vai trò' },
              { id: 'Subject', label: 'Môn dạy' },
              { id: 'email', label: 'E-mail' },
              { id: 'gender', label: 'Giới tính' },
              { id: '' },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <CLassDetails
            fetchMyClass={() => fetchMyClass()}
            title="Thông tin học sinh"
            myClass={myClass}
            classID={classID}
            user={user}
            tableLabels={[
              { id: 'STT', label: '' },
              { id: 'name', label: 'Họ và tên' },
              { id: 'birthDate', label: 'Ngày sinh' },
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
