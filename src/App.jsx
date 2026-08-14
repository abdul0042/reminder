import React, { useState } from 'react';
import { SubscriptionProvider, useSubscriptions } from './context/SubscriptionContext';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import UpcomingSlider from './components/UpcomingSlider';
import SubscriptionItem from './components/SubscriptionItem';
import SubscriptionDetailModal from './components/SubscriptionDetailModal';
import AddSubscriptionForm from './components/AddSubscriptionForm';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import LiquidTabBar from './components/LiquidTabBar';
import PWAGuideModal from './components/PWAGuideModal';
import SplashLoader from './components/SplashLoader';
import Toast from './components/Toast';
import { CreditCard } from 'lucide-react';

function DashboardContent() {
  const {
    user,
    authLoading,
    handleGoogleLogin,
    subscriptions,
    loading,
    activeTab,
    setIsAddModalOpen,
    darkMode
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
            /* UnSub Google Sign-In Welcome Card */
            <div className="py-10 px-6 rounded-[32px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 text-center space-y-6 animate-in fade-in duration-300 my-4">
              <div className="w-20 h-20 rounded-3xl bg-white dark:bg-[#1A1918] p-2 mx-auto shadow-md border border-black/5 dark:border-white/10 flex items-center justify-center">
                <img src="/logo.png" alt="UnSub Logo" className="w-full h-full object-contain rounded-2xl" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[#1C1917] dark:text-[#F5F5F3] tracking-tight">
                  Welcome to UnSub
                </h2>
                <p className="text-xs font-semibold text-[#78746D] dark:text-[#A8A29E] max-w-xs mx-auto mt-1.5 leading-relaxed">
                  Track recurring bills, upcoming renewals, and category spend with your secure Google Account.
                </p>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full py-4 rounded-[20px] bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold text-sm shadow-md transition-all touch-shrink flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          ) : activeTab === 'analytics' ? (
            <AnalyticsView />
          ) : activeTab === 'add' ? (
            <AddSubscriptionForm isModal={false} />
          ) : activeTab === 'settings' ? (
            <SettingsView />
          ) : (
            <>
              <BalanceCard />
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
