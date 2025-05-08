import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import RolePage from 'pages/role'; 

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// master tables
// Import master table pages
const Countries = Loadable(lazy(() => import('pages/master/Countries')));
const States = Loadable(lazy(() => import('pages/master/States')));
const Cities = Loadable(lazy(() => import('pages/master/Cities')));
const Properties = Loadable(lazy(() => import('pages/master/Properties')));
const OwnershipType = Loadable(lazy(() => import('pages/master/OwnershipType')));
const BHKType = Loadable(lazy(() => import('pages/master/BHKType')));
const PropertyType = Loadable(lazy(() => import('pages/master/PropertyType')));
const DocumentType = Loadable(lazy(() => import('pages/master/DocumentType')));

const Profile = Loadable(lazy(() => import('@/layout/Dashboard/Header/HeaderContent/Profile')));
const EditProfile = Loadable(lazy(() => import('@/layout/Dashboard/Header/HeaderContent/Profile/EditProfile')));

const AddRoleForm = Loadable(lazy(() => import('pages/role/AddRole')));
const EditRoleForm = Loadable(lazy(() => import('pages/role/EditRole')));

// users - Removed static import
const IndexUser = Loadable(lazy(() => import('pages/users/IndexUser')));
const AddUser = Loadable(lazy(() => import('pages/users/AddUser')));
const EditUser = Loadable(lazy(() => import('pages/users/EditUser')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <ProtectedRoute />, 
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/',
          element: <DashboardDefault />
        },
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <DashboardDefault />
            }
          ]
        },
        {
          path: 'typography',
          element: <Typography />
        },
        {
          path: 'color',
          element: <Color />
        },
        {
          path: 'shadow',
          element: <Shadow />
        },
        {
          path: 'sample-page',
          element: <SamplePage />
        },
        { path: 'master/countries', element: <Countries /> },
        { path: 'master/states', element: <States /> },
        { path: 'master/cities', element: <Cities /> },
        { path: 'master/properties', element: <Properties /> },
        { path: 'master/ownership-type', element: <OwnershipType /> },
        { path: 'master/bhk-type', element: <BHKType /> },
        { path: 'master/property-type', element: <PropertyType /> },
        { path: 'master/document-type', element: <DocumentType /> },
        { path: 'profile', element: <Profile /> },
        { path: 'edit-profile', element: <EditProfile /> },
        { path: 'role', element: <RolePage />},
        {
          path: 'add-role',
          element: <AddRoleForm />
        },
        {
          path: 'edit-role/:id',
          element: <EditRoleForm />
        },
        {
          path: 'users',
          element: <IndexUser />
        },
        {
          path: 'add-user',
          element: <AddUser />
        },
        {
          path: 'edit-user/:id',
          element: <EditUser />
        }
      ]
    }
  ]
};

export default MainRoutes;
