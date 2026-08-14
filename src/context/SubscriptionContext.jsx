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
    return localStorage.getItem('subpulse_theme') === 'dark';
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
    return localStorage.getItem('subpulse_currency') || 'INR';
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
      localStorage.setItem('subpulse_theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#EBE6DD';
      localStorage.setItem('subpulse_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Listen to PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsPWAInstalled(true);
      setDeferredPrompt(null);
      showToast('SubPulse App installed successfully!', 'success');
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
        showToast('Installing SubPulse App...', 'success');
      }
      setDeferredPrompt(null);
    } else {
      // Show visual PWA step-by-step guide for iOS / Chrome Mobile / HTTP
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
    localStorage.setItem('subpulse_currency', currency);
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
      setSubscriptions(data.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, selectedCategory, searchQuery, sortBy, statusFilter]);

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
