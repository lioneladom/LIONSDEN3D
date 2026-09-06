import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { AuthModal } from './components/common/AuthModal';
import { SearchModal } from './components/common/SearchModal';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ConfiguratorPage } from './pages/ConfiguratorPage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackerPage } from './pages/OrderTrackerPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { MaterialsCatalogPage } from './pages/MaterialsCatalogPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminModelInspector } from './pages/admin/AdminModelInspector';
import { AdminPricing } from './pages/admin/AdminPricing';
import { AdminMaterials } from './pages/admin/AdminMaterials';
import { AdminPrintSettings } from './pages/admin/AdminPrintSettings';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';

export const AppContent: React.FC = () => {
  const { activePage, adminTab, pageTransition } = useApp();

  // If in Admin Login Mode, render dedicated Chief Engineer Terminal
  if (activePage === 'admin-login') {
    return <AdminLoginPage />;
  }

  // If in Admin Mode, render the dedicated shop-owner control center
  if (activePage === 'admin' || activePage === 'admin-orders') {
    return (
      <AdminLayout>
        {adminTab === 'overview' && <AdminOverview />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'inspector' && <AdminModelInspector />}
        {adminTab === 'pricing' && <AdminPricing />}
        {adminTab === 'materials' && <AdminMaterials />}
        {adminTab === 'print-settings' && <AdminPrintSettings />}
        {adminTab === 'inventory' && <AdminInventory />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'analytics' && <AdminAnalytics />}
        {adminTab === 'settings' && <AdminPricing />}
      </AdminLayout>
    );
  }

  // Customer Application View
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text">
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Routed Page Body with Push-Down or Pull-Out Transitions */}
      <main className="flex-1 overflow-x-hidden">
        <div
          key={`${activePage}-${pageTransition}`}
          className={
            pageTransition === 'pull-out'
              ? 'animate-pull-out will-change-transform'
              : 'animate-push-down will-change-transform'
          }
        >
          {activePage === 'home' && <HomePage />}
          {activePage === 'configurator' && <ConfiguratorPage />}
          {activePage === 'shop' && <ShopPage />}
          {activePage === 'product-detail' && <ProductDetailPage />}
          {activePage === 'cart' && <CartPage />}
          {activePage === 'checkout' && <CheckoutPage />}
          {activePage === 'order-confirmation' && <OrderConfirmationPage />}
          {(activePage === 'order-tracker' || activePage === 'tracker') && <OrderTrackerPage />}
          {activePage === 'dashboard' && <CustomerDashboardPage />}
          {activePage === 'materials' && <MaterialsCatalogPage />}
          {activePage === 'how-it-works' && <HowItWorksPage />}
          {activePage === 'about' && <AboutPage />}
          {activePage === 'contact' && <ContactPage />}
          {activePage === 'faq' && <FaqPage />}
          {(activePage === 'login' || activePage === 'signup') && <LoginPage />}
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <AuthModal />
      <SearchModal />
    </div>
  );
};

export default AppContent;
