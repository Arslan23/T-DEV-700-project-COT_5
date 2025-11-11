export default function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    emailNotifications: "Receive updates and alerts via email",
    clockReminders: "Get reminders to clock in and out",
    teamUpdates: "Stay informed about team changes and announcements",
    weeklyReports: "Receive weekly performance reports",
    systemAlerts: "Get notified about system updates and maintenance",
  };
  return descriptions[key] || "";
}
