import React from 'react';
import { Container, Grid, Stack } from '@mui/material';
import { ClassNewestBooking } from '../../class';
import { _subjects, _subjectNew, _subjectsOverview, _subjectReview } from '../../../../_mock/arrays';
import { useSettingsContext } from '../../../../components/settings';

export default function ManageSubject({ fetchMyClass, classID, myClass, user }) {
  const { themeStretch } = useSettingsContext();
  const countSubject = myClass?.subjects.length;
  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <ClassNewestBooking
          fetchMyClass={() => fetchMyClass()}
          classID={classID}
          myClass={myClass}
          user={user}
          title="Môn học hiện có trong lớp"
          subheader={countSubject}
        />
      </Container>
    </>
  );
}
