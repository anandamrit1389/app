import NotificationService from '@/api/notificationService';
import useFetch from '@/hooks/useFetch';
import { INotification } from '@/interfaces/INotification';
import { createContext, ReactNode, useEffect, useState } from 'react';

interface NotificationsContextProps {
  children: ReactNode;
}

interface NotificationsContext {
  notifications: INotification[];
  newNotificationsCount: number;
  handleUpdateNotifications: (id: string, isWatched: boolean) => void;
  increaseNewNotificationsCount: () => void;
  decreaseNewNotificationsCount: () => void;
}

const initialNotifications: [] = [];

const initialAuthContext: NotificationsContext = {
  notifications: [],
  newNotificationsCount: 0,
  handleUpdateNotifications: () => {},
  increaseNewNotificationsCount: () => {},
  decreaseNewNotificationsCount: () => {},
};

export const NotificationsContext = createContext<NotificationsContext>(initialAuthContext);

const NotificationsProvider = ({ children }: NotificationsContextProps) => {
  const [notifications, setNotifications] = useState<INotification[]>(initialNotifications);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  const { data: notificationsData } = useFetch(NotificationService.getAllNotifications);

  const handleUpdateNotifications = (id: string, isWatched: boolean) => {
    setNotifications((prevNotifications) => {
      return prevNotifications.map((notification) => {
        if (notification.id === id) {
          return { ...notification, isWatched };
        }

        return notification;
      });
    });
  };

  const increaseNewNotificationsCount = () => {
    setNewNotificationsCount((prevCount) => prevCount + 1);
  };

  const decreaseNewNotificationsCount = () => {
    setNewNotificationsCount((prevCount) => prevCount - 1);
  };

  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData);

      const newNotifications = notificationsData.filter((notification) => !notification.isWatched);
      setNewNotificationsCount(Number(newNotifications.length));
    }
  }, [notificationsData]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        newNotificationsCount,
        handleUpdateNotifications,
        increaseNewNotificationsCount,
        decreaseNewNotificationsCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
