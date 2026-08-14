import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, loginWithGoogle, logoutUser } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { CURRENCIES } from '../data/presets';

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [subscriptions, setSubscriptions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('unsub_theme') === 'dark';
  });

  // Device Notifications Permission State
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  // PWA Installation state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showPWAGuide, setShowPWAGuide] = useState(false);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('renewal');
  const [statusFilter, setStatusFilter] = useState('active');
  
  // UI & Modals State
  const [selectedSub, setSelectedSub] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Default Currency strictly INR (Rupees ₹)
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('unsub_currency') || 'INR';
  });

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Sync Dark Mode state to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#121212';
      localStorage.setItem('unsub_theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#EBE6DD';
      localStorage.setItem('unsub_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Request Device Notification Permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      showToast('Notifications are not supported on this browser', 'error');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        showToast('Device notifications enabled!', 'success');
        sendTestNotification();
        return true;
      } else {
        setNotificationsEnabled(false);
        showToast('Notification permission denied', 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      showToast('Error enabling notifications', 'error');
      return false;
    }
  };

  // Send Test Push Notification
  const sendTestNotification = () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      showToast('Please enable notifications first', 'error');
      return;
    }

    const title = 'UnSub Alert Active 🔔';
    const options = {
      body: 'Notifications are live! You will be alerted before your subscriptions renew.',
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [200, 100, 200]
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }
    showToast('Sent test notification to your device!', 'success');
  };

  // Dispatch Renewal Notification Alert
  const checkAndSendRenewalNotifications = useCallback((subs) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    subs.forEach(sub => {
      if (sub.status !== 'active' || !sub.nextBillingDate) return;
      
      const target = new Date(sub.nextBillingDate);
      const diffTime = target - today;
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (days >= 0 && days <= 3) {
        const title = `UnSub Bill Alert 🔔`;
        const body = days === 0 
          ? `${sub.serviceName} renews TODAY!`
          : `${sub.serviceName} renews in ${days} day${days > 1 ? 's' : ''}!`;

        const options = {
          body,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: `unsub_renew_${sub.id}_${days}`
        };

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(reg => reg.showNotification(title, options));
        } else {
          new Notification(title, options);
        }
      }
    });
  }, []);

  // Listen to PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsPWAInstalled(true);
      setDeferredPrompt(null);
      showToast('UnSub App installed successfully!', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsPWAInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showToast]);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('Installing UnSub App...', 'success');
      }
      setDeferredPrompt(null);
    } else {
      setShowPWAGuide(true);
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync Currency to localStorage
  useEffect(() => {
    localStorage.setItem('unsub_currency', currency);
  }, [currency]);

  // Fetch Subscriptions from REST API
  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        category: selectedCategory,
        search: searchQuery,
        sortBy,
        status: statusFilter,
        userId: user?.uid || ''
      });

      const res = await fetch(`/api/subscriptions?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch subscriptions');
      const data = await res.json();
      const items = data.data || [];
      setSubscriptions(items);
      setError(null);
      checkAndSendRenewalNotifications(items);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, selectedCategory, searchQuery, sortBy, statusFilter, checkAndSendRenewalNotifications]);

  // Fetch Analytics Summary from REST API
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`/api/analytics/monthly-total?userId=${user?.uid || ''}`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      setAnalytics(data.data);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchSubscriptions();
    fetchAnalytics();
  }, [fetchSubscriptions, fetchAnalytics]);

  // CRUD Actions
  const addSubscription = async (subData) => {
    try {
      const payload = { ...subData, currency: 'INR', userId: user?.uid || 'default_user' };
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showToast(`Added ${subData.serviceName} subscription!`, 'success');
        fetchSubscriptions();
        fetchAnalytics();
        setIsAddModalOpen(false);
        return true;
      } else {
        showToast(data.error || 'Failed to add subscription', 'error');
        return false;
      }
    } catch (err) {
      showToast('Server error while adding subscription', 'error');
      return false;
    }
  };

  const updateSubscription = async (id, updateData) => {
    try {
      const payload = { ...updateData, userId: user?.uid || 'default_user' };
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showToast(`Updated ${data.data.serviceName} plan details`, 'success');
        fetchSubscriptions();
        fetchAnalytics();
        if (selectedSub && selectedSub.id === id) {
          setSelectedSub(data.data);
        }
        return true;
      } else {
        showToast(data.error || 'Failed to update subscription', 'error');
        return false;
      }
    } catch (err) {
      showToast('Server error while updating subscription', 'error');
      return false;
    }
  };

  const deleteSubscription = async (id) => {
    const target = subscriptions.find(s => s.id === id);
    try {
      const res = await fetch(`/api/subscriptions/${id}?userId=${user?.uid || 'default_user'}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        showToast(`Removed ${target?.serviceName || 'subscription'}`, 'info');
        fetchSubscriptions();
        fetchAnalytics();
        if (selectedSub?.id === id) {
          setSelectedSub(null);
        }
        return true;
      } else {
        showToast(data.error || 'Failed to delete subscription', 'error');
        return false;
      }
    } catch (err) {
      showToast('Server error while deleting subscription', 'error');
      return false;
    }
  };

  const activeCurrencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  const formatPrice = (amount) => {
    const val = Number(amount) || 0;
    const converted = (val * activeCurrencyObj.rate);
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(converted);
    return `${activeCurrencyObj.symbol}${formatted}`;
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      showToast('Successfully signed in with Google!', 'success');
    } catch (err) {
      showToast('Google Sign-In: ' + (err.message || 'Cancelled'), 'error');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    showToast('Signed out', 'info');
  };

  return (
    <SubscriptionContext.Provider
      value={{
        user,
        authLoading,
        handleGoogleLogin,
        handleLogout,
        installPWA,
        canInstallPWA: !!deferredPrompt,
        isPWAInstalled,
        showPWAGuide,
        setShowPWAGuide,
        subscriptions,
        analytics,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        statusFilter,
        setStatusFilter,
        selectedSub,
        setSelectedSub,
        isAddModalOpen,
        setIsAddModalOpen,
        activeTab,
        setActiveTab,
        darkMode,
        toggleDarkMode,
        currency,
        setCurrency,
        activeCurrencyObj,
        formatPrice,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        notificationsEnabled,
        requestNotificationPermission,
        sendTestNotification,
        toast,
        showToast,
        refreshData: () => { fetchSubscriptions(); fetchAnalytics(); }
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within SubscriptionProvider');
  }
  return context;
}
