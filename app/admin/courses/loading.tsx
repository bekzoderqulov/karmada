import { PurchaseProvider } from '@/context/purchase-context';
import CoursesPage from './page';

export default function Page() {
  return (
    <PurchaseProvider>
      <CoursesPage />
    </PurchaseProvider>
  );
}

