import { Outlet } from 'react-router-dom';
import UserHeader from '../components/user/UserHeader';
import UserNavigation from '../components/user/UserNavigation';

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <UserHeader />
      
      <main className="pb-16">
        <Outlet />
      </main>
      
      <UserNavigation />
    </div>
  );
}