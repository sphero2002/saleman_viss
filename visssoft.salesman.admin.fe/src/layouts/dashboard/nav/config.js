// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';
import AutoStoriesIcon from '@mui/material/';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  class: icon('ic_classroom'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Chung',
    items: [
      { title: 'Trang Chủ', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Chương trình học', path: PATH_DASHBOARD.program.choose, icon: ICONS.kanban },
      // CLASS
      {
        title: 'Lớp học của tôi',
        path: PATH_DASHBOARD.myclass.root,
        icon: ICONS.class,
      },
      // DOCUMENT
      {
        title: 'Tài liệu của tôi',
        path: PATH_DASHBOARD.documents.root,
        icon: ICONS.blog,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.documents.posts },
          // { title: 'Chi tiết', path: PATH_DASHBOARD.documents.demoView },
          // { title: 'Tạo mới', path: PATH_DASHBOARD.documents.new },
        ],
      },
      { title: 'Học liệu', path: PATH_DASHBOARD.folder.root, icon: ICONS.file },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản lý hệ thống',
    items: [
      {
        title: 'Lớp học',
        path: PATH_DASHBOARD.class.root,
        icon: ICONS.class,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.class.root },
          { title: 'Tạo lớp', path: PATH_DASHBOARD.class.new },
        ],
      },
      {
        title: 'Vai trò',
        path: PATH_DASHBOARD.role.list,
        icon: ICONS.external,
      },
      {
        title: 'Quyền hạn',
        path: PATH_DASHBOARD.permission.list,
        icon: ICONS.blank,
      },
      {
        title: 'Người dùng',
        path: PATH_DASHBOARD.user.list,
        icon: ICONS.user,
      },

      {
        title: 'Chương trình học',
        path: PATH_DASHBOARD.program.list,
        icon: ICONS.kanban,
      },

      {
        title: 'Cấp học',
        path: PATH_DASHBOARD.level.list,
        icon: ICONS.menuItem,
      },

      {
        title: 'Khối học',
        path: PATH_DASHBOARD.grade.list,
        icon: ICONS.label,
      },

      {
        title: 'Môn học',
        path: PATH_DASHBOARD.subject.list,
        icon: ICONS.booking,
      },

      {
        title: 'Tiết học',
        path: PATH_DASHBOARD.slot.list,
        icon: ICONS.disabled,
      },

      {
        title: 'Loại tài liệu',
        path: PATH_DASHBOARD.type_documents.list,
        icon: ICONS.folder,
      },
      {
        title: 'Quản lý tài liệu',
        path: PATH_DASHBOARD.fileManager,
        icon: ICONS.folder,
      },
    ],
  },
];

export default navConfig;
