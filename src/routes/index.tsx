import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import LandingPage from '../pages/LandingPage';
import DashboardLayout from '../layouts/DashboardLayout';
import CandidatePortal from '../pages/CandidatePortal';
import RecruiterDashboard from '../pages/RecruiterDashboard';
import TalentAnalytics from '../pages/TalentAnalytics';
import SystemLogs from '../pages/SystemLogs';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'apply',
        element: <CandidatePortal />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <RecruiterDashboard />,
      },
      {
        path: 'analytics',
        element: <TalentAnalytics />,
      },
      {
        path: 'logs',
        element: <SystemLogs />,
      },
      {
        path: ':id',
        element: <RecruiterDashboard />,
      }
    ]
  }
]);
