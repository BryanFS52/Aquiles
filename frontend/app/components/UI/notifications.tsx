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
    <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center p-2">
        <span className="text-[#00324d] font-inter font-bold">Notifications</span>
        <button
          className="text-[#00324d] hover:text-[#40b003] text-sm font-inter"
          onClick={markAllAsRead}
        >
          Marcar todo como leído
        </button>
      </div>
      <ul className="p-2 max-h-96 overflow-y-auto">
        {notifications.map((notification: Notification, index: number) => (
          <li
            key={`${notification.id}-${index}`}
            className={`flex items-center p-2 rounded-lg cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}
            onClick={() => handleNotificationClick(notification.id)}
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[#e6f2ff]">
              {notification.isSystem ? (
                <BellRing className="w-6 h-6 text-[#00324d]" />
              ) : (
                <Image
                  src={notification.avatar || ''}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                  priority={index < 2}
                  placeholder="blur"
                  blurDataURL="/img/blur-placeholder.jpg"
                />
              )}
            </div>
            <div className="ml-4 flex-1">
              <p className="text-[#00324d]">
                <strong className="hover:text-[#40b003]">{notification.user}</strong> {notification.action}{' '}
                {notification.content && (
                  <strong className="text-[#40b003]">{notification.content}</strong>
                )}
              </p>
              <p className="text-gray-500 text-sm">{notification.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

Notifications.unreadCount = notificationsData.filter((n: Notification) => n.unread).length;