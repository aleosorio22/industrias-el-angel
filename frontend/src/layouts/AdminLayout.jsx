import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-cream-dark">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}