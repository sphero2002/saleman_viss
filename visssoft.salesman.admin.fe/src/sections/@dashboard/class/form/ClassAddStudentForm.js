import React from 'react';
// API
import {useRouter} from 'next/router';
import ClassNewEditMemberDetails from './ClassNewEditMemberDetails';

export default function ClassAddStudentForm({ isEdit = false, classID }) {
  const { push } = useRouter();

  return (
    <div>
      <ClassNewEditMemberDetails classID={classID} />
    </div>
  );
}
