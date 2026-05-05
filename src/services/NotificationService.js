import { LocalNotifications } from '@capacitor/local-notifications';

export const triggerPriorityWindow = async (driverId, riderIds) => {
  for (let i = 0; i < riderIds.length; i++) {
    const riderId = riderIds[i];
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Your usual driver is leaving soon!",
            body: "Driver is starting their commute. Book now for priority seat.",
            id: new Date().getTime() + i,
            schedule: { at: new Date(Date.now() + 1000) },
            actionTypeId: "",
            extra: null
          }
        ]
      });
    } catch (e) {
      console.log("Local notifications not available, simulating push.");
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Your usual driver is leaving soon!", {
            body: "Driver is starting their commute. Book now for priority seat."
          });
        } else if (Notification.permission !== "denied") {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            new Notification("Your usual driver is leaving soon!", {
              body: "Driver is starting their commute. Book now for priority seat."
            });
          }
        }
      }
    }
  }
};

export const broadcastToGlobal = async (rideId, users) => {
  for (let i = 0; i < users.length; i++) {
    console.log("Broadcasting ride " + rideId + " to user " + users[i].id);
  }
};
