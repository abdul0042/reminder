import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { CURRENCIES } from '../data/presets';
import { playAlarmSound } from '../utils/playAlarmSound';

const ensureAlarmChannel = async () => {
  try {
    await LocalNotifications.createChannel({
      id: 'unsub_alarm_channel',
      name: 'UnSub Loud Reminder Alarms',
      description: 'Loud alarm notifications with sound and vibration for subscription renewals',
      importance: 5, // MAX importance - pops up as banner on screen & rings sound
      visibility: 1, // Public on lockscreen
      vibration: true,
      lights: true,
      lightColor: '#DF4F38'
    });
  } catch (e) {
    console.warn('Channel creation error:', e);
  }
};

const scheduleNativeBackgroundAlarm = async (idNum, title, body, fireAtDate) => {
  try {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display === 'granted') {
      await ensureAlarmChannel();
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `⏰ UnSub Alarm: ${title}`,
            body: body || `Reminder alert for ${title}`,
            id: Math.abs(idNum) % 2147483647,
            schedule: { at: new Date(fireAtDate), allowWhileIdle: true },
            channelId: 'unsub_alarm_channel',
            sound: 'alarm.wav',
            actionTypeId: '',
            extra: null
          }
        ]
      });
    }
  } catch (err) {
    console.warn('Native LocalNotification schedule skipped or failed:', err);
  }
};

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  // Persistent Direct DB / Local User Auth State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('unsub_db_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('unsub_db_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('unsub_db_user');
    }
  }, [user]);

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

  // Active Timers & Subscription Snooze Alarms State
  const [activeReminders, setActiveReminders] = useState(() => {
    try {
      const saved = localStorage.getItem('unsub_active_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // General Quick Reminders & Tasks State
  const [generalReminders, setGeneralReminders] = useState(() => {
    try {
      const saved = localStorage.getItem('unsub_general_reminders');
      return saved ? JSON.parse(saved) : [
        {
          id: 'gen_1',
          title: 'Get signature from manager',
          dueTime: 'Today at 5:00 PM',
          completed: false,
          createdAt: new Date().toISOString()
        }
      ];
    } catch (e) {
      return [];
    }
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
  const [isGeneralReminderModalOpen, setIsGeneralReminderModalOpen] = useState(false);
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

  // Sync activeReminders and generalReminders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('unsub_active_reminders', JSON.stringify(activeReminders));
    } catch (e) {}
  }, [activeReminders]);

  useEffect(() => {
    try {
      localStorage.setItem('unsub_general_reminders', JSON.stringify(generalReminders));
    } catch (e) {}
  }, [generalReminders]);

  // Trigger Notification + Sound + Vibration
  const triggerAlarmAlert = useCallback((titleText, note = '') => {
    playAlarmSound();

    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate([300, 100, 300, 100, 300]);
    }

    const title = `⏰ UnSub Reminder: ${titleText}`;
    const options = {
      body: note || `Reminder alert: ${titleText}`,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: `unsub_general_${Date.now()}`,
      vibrate: [300, 100, 300]
    };

    if ('Notification' in window && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => reg.showNotification(title, options));
      } else {
        new Notification(title, options);
      }
    }

    showToast(`⏰ REMINDER: ${titleText}`, 'info');
  }, [showToast]);

  // Add General Task / Reminder
  const addGeneralReminder = (title, minutes = 5, note = '') => {
    const id = `gen_${Date.now()}`;
    const durationMs = Math.max((minutes || 1), 0.016) * 60 * 1000;
    const fireAt = Date.now() + durationMs;

    const newGen = {
      id,
      title,
      note,
      minutes,
      fireAt,
      status: 'pending', // pending | rang | completed
      completed: false,
      createdAt: new Date().toISOString()
    };

    setGeneralReminders(prev => [newGen, ...prev]);

    // Schedule native Android OS background alarm (triggers even if app is closed)
    scheduleNativeBackgroundAlarm(Date.now(), title, note, fireAt);

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setTimeout(() => {
      // Mark as 'rang' after the alarm fires
      setGeneralReminders(prev =>
        prev.map(item => item.id === id ? { ...item, status: 'rang' } : item)
      );
      triggerAlarmAlert(title, note);
    }, durationMs);

    showToast(`⏳ Reminder set: "${title}" in ${minutes} min${minutes === 1 ? '' : 's'}`, 'success');
  };

  const toggleGeneralReminderComplete = (id) => {
    setGeneralReminders(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteGeneralReminder = (id) => {
    setGeneralReminders(prev => prev.filter(item => item.id !== id));
    showToast('Deleted reminder', 'info');
  };

  // Schedule Quick Subscription Timer Reminder (e.g., 5 mins, 15 mins, 60 mins)
  const scheduleReminder = (serviceName, minutes) => {
    const durationMs = minutes * 60 * 1000;
    const fireAt = Date.now() + durationMs;

    const newReminder = {
      id: `rem_${Date.now()}`,
      serviceName,
      minutes,
      fireAt,
      createdAt: new Date().toISOString()
    };

    setActiveReminders(prev => [...prev, newReminder]);

    // Schedule native Android OS background alarm
    scheduleNativeBackgroundAlarm(Date.now(), `Check ${serviceName}`, `Subscription reminder for ${serviceName}`, fireAt);

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setTimeout(() => {
      triggerAlarmAlert(`Check ${serviceName}`);
      setActiveReminders(prev => prev.filter(r => r.id !== newReminder.id));
    }, durationMs);

    showToast(`Set ${minutes}-minute alarm for ${serviceName}! ⏰`, 'success');
  };

  // Cancel an active timer
  const cancelReminder = (id) => {
    setActiveReminders(prev => prev.filter(r => r.id !== id));
    showToast('Cancelled reminder alarm', 'info');
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
    playAlarmSound();

    if ('Notification' in window && Notification.permission === 'granted') {
      const title = 'UnSub Alert Active 🔔';
      const options = {
        body: 'Notifications and sound chime are live! You will be alerted before any subscription renews.',
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
    }

    showToast('Sent test notification & alarm sound to your device!', 'success');
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

  // CRUD Actions for Subscriptions
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

  const handleEmailSignUp = async (email, password, displayName) => {
    if (!email || !password) throw new Error('Please enter an email and password.');
    const cleanEmail = email.trim().toLowerCase();
    const newUser = {
      uid: 'user_' + Date.now(),
      email: cleanEmail,
      displayName: displayName || cleanEmail.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    try {
      const existingUsers = JSON.parse(localStorage.getItem('unsub_registered_users') || '{}');
      existingUsers[cleanEmail] = { ...newUser, password };
      localStorage.setItem('unsub_registered_users', JSON.stringify(existingUsers));
    } catch (e) {}

    setUser(newUser);
    showToast('Account created successfully!', 'success');
  };

  const handleEmailLogin = async (email, password) => {
    if (!email || !password) throw new Error('Please enter an email and password.');
    const cleanEmail = email.trim().toLowerCase();
    
    let existingUsers = {};
    try {
      existingUsers = JSON.parse(localStorage.getItem('unsub_registered_users') || '{}');
    } catch (e) {}

    const match = existingUsers[cleanEmail];
    if (match) {
      if (match.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }
      setUser({ uid: match.uid, email: match.email, displayName: match.displayName });
      showToast('Signed in successfully!', 'success');
    } else {
      // Auto-register and sign in user smoothly
      const newUser = {
        uid: 'user_' + Date.now(),
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        createdAt: new Date().toISOString()
      };
      existingUsers[cleanEmail] = { ...newUser, password };
      try {
        localStorage.setItem('unsub_registered_users', JSON.stringify(existingUsers));
      } catch (e) {}
      setUser(newUser);
      showToast('Signed in successfully!', 'success');
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      uid: 'guest_user_123',
      email: 'user@unsub.app',
      displayName: 'UnSub User',
      photoURL: null
    };
    setUser(guestUser);
    showToast('Signed in as Demo User!', 'success');
  };

  const handleLogout = async () => {
    setUser(null);
    try {
      localStorage.removeItem('unsub_db_user');
    } catch (e) {}
    showToast('Signed out', 'info');
  };

  return (
    <SubscriptionContext.Provider
      value={{
        user,
        authLoading,
        handleEmailSignUp,
        handleEmailLogin,
        handleGuestLogin,
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
        isGeneralReminderModalOpen,
        setIsGeneralReminderModalOpen,
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
        activeReminders,
        scheduleReminder,
        cancelReminder,
        generalReminders,
        addGeneralReminder,
        toggleGeneralReminderComplete,
        deleteGeneralReminder,
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
