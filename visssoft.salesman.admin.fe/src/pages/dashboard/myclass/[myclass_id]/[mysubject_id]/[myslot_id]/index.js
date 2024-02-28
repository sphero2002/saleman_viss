import React from 'react';
import DashboardLayout from '../../../../../../layouts/dashboard';

index.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default function index() {
  return <div>index</div>;
}
