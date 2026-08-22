import React, { useState } from 'react';
import { SubscriptionProvider, useSubscriptions } from './context/SubscriptionContext';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import UpcomingSlider from './components/UpcomingSlider';
import ActiveRemindersBanner from './components/ActiveRemindersBanner';
import ActiveAlertStrip from './components/ActiveAlertStrip';
import SubscriptionItem from './components/SubscriptionItem';
import SubscriptionDetailModal from './components/SubscriptionDetailModal';
import AddSubscriptionForm from './components/AddSubscriptionForm';
import AnalyticsView from './components/AnalyticsView';
import AuthCard from './components/AuthCard';
import SettingsView from './components/SettingsView';
import LiquidTabBar from './components/LiquidTabBar';
import PWAGuideModal from './components/PWAGuideModal';
import SplashLoader from './components/SplashLoader';
import Toast from './components/Toast';
import { CreditCard, Download } from 'lucide-react';

function DashboardContent() {
  const {
    user,
    authLoading,
    subscriptions,
    loading,
    activeTab,
    setIsAddModalOpen,
  } = useSubscriptions();

  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#EBE6DD] dark:bg-[#121212] text-[#1C1917] dark:text-[#F5F5F3] flex justify-center items-center overflow-hidden transition-colors duration-300">
      
      {/* App Opener Splash Loader Screen */}
      {!splashFinished && (
        <SplashLoader onComplete={() => setSplashFinished(true)} />
      )}

      {/* Centered Mobile Canvas Frame */}
      <div className="w-full max-w-md h-full sm:h-[840px] sm:max-h-[92vh] sm:rounded-[36px] bg-[#EBE6DD] dark:bg-[#121212] sm:shadow-2xl sm:border sm:border-black/5 sm:dark:border-white/10 flex flex-col justify-between overflow-hidden relative">
        
        {/* 1. Header (Fixed Top) */}
        <div className="flex-shrink-0 z-20">
          <Header />
        </div>

        {/* 2. Main Content Area */}
        <main className="flex-1 overflow-y-auto px-5 pt-2 pb-24 space-y-5 no-scrollbar">
          
          {authLoading ? (
            <div className="py-20 text-center text-[#78746D] dark:text-[#A8A29E] text-xs font-bold animate-pulse">
              Authenticating with Firebase...
            </div>
          ) : !user ? (
            <AuthCard />
          ) : activeTab === 'analytics' ? (
            <AnalyticsView />
          ) : activeTab === 'add' ? (
            <AddSubscriptionForm isModal={false} />
          ) : activeTab === 'settings' ? (
            <SettingsView />
          ) : (
            <>
              <BalanceCard />
              <ActiveAlertStrip />
              <UpcomingSlider />

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F5F3] tracking-tight">
                    All Subscriptions
                  </h2>
                  <span className="text-xs font-bold text-[#78746D] dark:text-[#A8A29E]">
                    {subscriptions.length} active plans
                  </span>
                </div>

                {loading ? (
                  <div className="py-8 text-center text-[#78746D] dark:text-[#A8A29E] text-xs font-bold animate-pulse">
                    Fetching your live subscriptions...
                  </div>
                ) : subscriptions.length === 0 ? (
                  <div className="py-10 px-4 rounded-[28px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#DF4F38] text-white mx-auto flex items-center justify-center shadow-sm">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-sm text-[#1C1917] dark:text-[#F5F5F3]">
                      No subscriptions added yet
                    </h3>
                    <p className="text-xs font-semibold text-[#78746D] dark:text-[#A8A29E] max-w-xs mx-auto">
                      Tap the button below to add your first recurring subscription.
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-5 py-2.5 rounded-full bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold text-xs shadow-md transition-all"
                    >
                      Add Subscription
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pb-2">
                    {subscriptions.map((item) => (
                      <SubscriptionItem key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </main>

        {/* 3. Floating Dynamic Island Navigation */}
        {user && <LiquidTabBar />}

      </div>

      {/* Floating Modals */}
      <SubscriptionDetailModal />
      <AddSubscriptionForm isModal={true} />
      <PWAGuideModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <SubscriptionProvider>
      <DashboardContent />
    </SubscriptionProvider>
  );
}
