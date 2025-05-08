import { IconUserCircle } from '@tabler/icons-react';

const users = {
  id: 'users',
  title: 'Users List',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: IconUserCircle,
      breadcrumbs: false
    }
  ]
};

export default users;
