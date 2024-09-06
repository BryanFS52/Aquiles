import React, { useState, useEffect } from "react";

// Notificaciones estáticas y recordatorios de ejemplo (en lugar de obtener desde backend)
const notificationsData = [
  {
    id: 1,
    user: 'Coordinación',
    action: 'Acercarse el dia sabado 17 de julio a las',
    content: '8:00 am',
    time: '1m ago',
    unread: true,
    avatar: '/img/InstructorAvatar.jpg',
  },
  {
    id: 2,
    user: 'Diego Boada',
    action: 'Es tu nuevo instructor tecnico',
    time: '1h ago',
    unread: true,
    avatar: '/img/InstructorAvatar.jpg',
  },
  {
    id: 3,
    user: 'Julian Paredes',
    action: 'Nuevo aprendiz en la ficha',
    content: '278483',
    time: '1 day ago',
    unread: true,
    avatar: '/img/InstructorAvatar.jpg',
  },
  {
    id: 4,
    user: 'Katalina Torres',
    action: 'Ha subido la justificación de su ausencia en el componente',
    time: '5 days ago',
    unread: false,
    avatar: '/img/InstructorAvatar.jpg',
    // image: '/assets/images/image-chess.webp',
  },
  {
    id: 5,
    user: 'Paula Contreras',
    action: 'No asistió al componente de Bases de datos',
    time: '1 week ago',
    unread: false,
    avatar: '/img/InstructorAvatar.jpg',
  },
  {
    id: 6,
    user: 'Natalia Martinez',
    action: 'Asignación a la nueva ficha',
    content: '2968472',
    time: '2 weeks ago',
    unread: false,
    avatar: '/img/InstructorAvatar.jpg',
  },
  {
    id: 7,
    user: 'Anna Rincon',
    action: 'es nueva la instructora tecnica de la ficha',
    content: '255794',
    time: '2 weeks ago',
    unread: false,
    avatar: '/img/InstructorAvatar.jpg',
  },
];

// Simulación de recordatorios basados en plazos de justificaciones
const fetchReminderNotifications = () => {
  // Simularías esta parte con datos reales obtenidos desde el backend.
  // Aquí se crean recordatorios para justificaciones pendientes.
  return [
    {
      id: 101,
      user: "Sistema",
      action: "Tienes una justificación pendiente por presentar antes del",
      content: "10 de septiembre",
      time: "2h ago",
      unread: true,
      avatar: "/img/ReminderIcon.jpg",
    },
    {
      id: 102,
      user: "Sistema",
      action: "El plazo para presentar tu justificación vence el",
      content: "12 de septiembre",
      time: "1 day ago",
      unread: true,
      avatar: "/img/ReminderIcon.jpg",
    },
  ];
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Fetch de recordatorios al cargar el componente
  useEffect(() => {
    const reminderNotifications = fetchReminderNotifications();
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      ...reminderNotifications,
    ]);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, unread: false })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map((notification) =>
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg">
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
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`flex items-center p-2 rounded-lg cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}
            onClick={() => handleNotificationClick(notification.id)}
          >
            <img
              src={notification.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-4 flex-1">
              <p className="text-[#00324d]">
                <strong className="hover:text-[#40b003]">{notification.user}</strong> {notification.action} {notification.content && <strong className="text-[#40b003]">{notification.content}</strong>}
              </p>
              <p className="text-gray-500 text-sm">{notification.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

Notifications.unreadCount = notificationsData.filter((n) => n.unread).length;
