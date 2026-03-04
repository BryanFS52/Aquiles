import React, { useState, useEffect } from "react";
import { notificationsData } from "@data/notificationData";
import { BellRing } from 'lucide-react';
import Image from "next/image";

interface Notification {
  id: number;
  user: string;
  action: string;
  content?: string;
  time: string;
  unread: boolean;
  isSystem?: boolean;
  avatar?: string;
}

interface NotificationsProps { }

const fetchReminderNotifications = (): Notification[] => [
  {
    id: 101,
    user: "Sistema",
    action: "Tienes una justificación pendiente por presentar antes del",
    content: "10 de septiembre",
    time: "2h ago",
    unread: true,
    isSystem: true,
  },
  {
    id: 102,
    user: "Sistema",
    action: "El plazo para presentar tu justificación vence el",
    content: "12 de septiembre",
    time: "1 day ago",
    unread: true,
    isSystem: true,
  },
];

export const Notifications: React.FC<NotificationsProps> & { unreadCount: number } = () => {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);

  useEffect(() => {
    const reminderNotifications = fetchReminderNotifications();
    setNotifications((prevNotifications: Notification[]) => [
      ...prevNotifications,
      ...reminderNotifications,
    ]);
  }, []);

  const markAllAsRead = (): void => {
    setNotifications(notifications.map((notification: Notification) => ({ ...notification, unread: false })));
  };

  const handleNotificationClick = (id: number): void => {
    setNotifications(notifications.map((notification: Notification) =>
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };

  return (
    <div className="fixed top-16 right-2 sm:absolute sm:right-0 sm:top-full mt-2 w-[calc(100vw-1rem)] max-w-72 sm:w-96 sm:max-w-none bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-100">
        <span className="text-[#00324d] font-inter font-bold text-sm sm:text-base">Notifications</span>
        <button
          className="text-[#00324d] hover:text-[#40b003] text-xs sm:text-sm font-inter transition-colors duration-200 px-2 py-1 rounded hover:bg-gray-50"
          onClick={markAllAsRead}
        >
          <span className="hidden sm:inline">Marcar todo como leído</span>
          <span className="sm:hidden">Marcar leído</span>
        </button>
      </div>
      <ul className="p-2 sm:p-3 max-h-80 sm:max-h-96 overflow-y-auto">
        {notifications.map((notification: Notification, index: number) => (
          <li
            key={`${notification.id}-${index}`}
            className={`flex items-start p-2 sm:p-3 rounded-lg cursor-pointer transition-colors duration-200 mb-2 last:mb-0 ${notification.unread
              ? 'bg-blue-50 hover:bg-blue-100'
              : 'hover:bg-gray-50'
              }`}
            onClick={() => handleNotificationClick(notification.id)}
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center bg-[#e6f2ff] flex-shrink-0">
              {notification.isSystem ? (
                <BellRing className="w-4 h-4 sm:w-6 sm:h-6 text-[#00324d]" />
              ) : (
                <Image
                  src={notification.avatar || ''}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  priority={index < 2}
                  placeholder="blur"
                  blurDataURL="/img/blur-placeholder.jpg"
                />
              )}
              {notification.unread && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#40b003] rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-[#00324d] text-sm sm:text-base leading-relaxed">
                <strong className="hover:text-[#40b003] transition-colors duration-200">{notification.user}</strong>{' '}
                <span className="break-words">{notification.action}</span>{' '}
                {notification.content && (
                  <strong className="text-[#40b003] break-words">{notification.content}</strong>
                )}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">{notification.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

Notifications.unreadCount = notificationsData.filter((n: Notification) => n.unread).length;