import { Outlet } from 'react-router-dom';
import DeliveryHeader from '../components/delivery/DeliveryHeader';
import DeliveryNavigation from '../components/delivery/DeliveryNavigation';

export default function DeliveryLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <DeliveryHeader />
      
      <main className="pb-16">
        <Outlet />
      </main>
      
      <DeliveryNavigation />
    </div>
  );
}