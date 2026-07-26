import { onSchedule } from "firebase-functions/v2/scheduler";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";

function getDb() {
  if (!getApps().length) {
    initializeApp();
  }
  return getFirestore();
}

/** Marks appointment leads due tomorrow for follow-up (extend with Resend email when configured). */
export const appointmentReminder = onSchedule(
  {
    schedule: "every 24 hours",
    region: "us-west1",
  },
  async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateKey = tomorrow.toISOString().slice(0, 10);

    const snapshot = await getDb()
      .collection("leads")
      .where("type", "==", "appointment")
      .where("preferredDate", "==", dateKey)
      .limit(50)
      .get();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.reminderSent) continue;
      await doc.ref.update({
        reminderSent: true,
        reminderSentAt: new Date().toISOString(),
      });
    }

    console.log(`appointmentReminder processed ${snapshot.size} leads for ${dateKey}`);
  },
);
