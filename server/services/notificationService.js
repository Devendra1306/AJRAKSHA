const { getMessaging } = require('../config/firebaseAdmin');

/**
 * Core send function. Handles single-token delivery.
 */
const sendNotification = async ({ token, title, body, image, data = {}, category }) => {
  const messaging = getMessaging();
  if (!messaging) return { success: false, error: 'Firebase Admin not initialized' };
  if (!token) return { success: false, error: 'FCM token required' };

  const message = {
    token,
    notification: {
      title,
      body,
      ...(image && { imageUrl: image }),
    },
    data: {
      category: category || 'general',
      clickAction: data.clickAction || '/dashboard',
      timestamp: new Date().toISOString(),
      ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    },
    webpush: {
      headers: { Urgency: 'high' },
      notification: {
        title,
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...(image && { image }),
        requireInteraction: true,
        actions: data.actions || [],
      },
      fcmOptions: {
        link: data.clickAction || '/dashboard',
      },
    },
    android: {
      priority: 'high',
      notification: {
        title,
        body,
        ...(image && { imageUrl: image }),
        channelId: category || 'general',
        color: '#f97316',
        clickAction: 'OPEN_ACTIVITY',
      },
    },
  };

  try {
    const messageId = await messaging.send(message);
    return { success: true, messageId };
  } catch (err) {
    console.error(`FCM send error [${category}]:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send to multiple FCM tokens.
 */
const sendBulkNotification = async ({ tokens, title, body, image, data = {}, category }) => {
  const messaging = getMessaging();
  if (!messaging) return { success: false, error: 'Firebase Admin not initialized' };
  if (!tokens || tokens.length === 0) return { success: false, error: 'No tokens provided' };

  const message = {
    notification: { title, body, ...(image && { imageUrl: image }) },
    data: {
      category: category || 'general',
      clickAction: data.clickAction || '/dashboard',
      timestamp: new Date().toISOString(),
      ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    },
    webpush: {
      headers: { Urgency: 'high' },
      notification: {
        title,
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...(image && { image }),
        requireInteraction: false,
      },
      fcmOptions: { link: data.clickAction || '/dashboard' },
    },
    tokens,
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    const failed = response.responses
      .map((r, i) => (!r.success ? { token: tokens[i], error: r.error?.message } : null))
      .filter(Boolean);

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      failed,
    };
  } catch (err) {
    console.error('Bulk FCM error:', err.message);
    return { success: false, error: err.message };
  }
};

// ─── Category-specific helpers ─────────────────────────────────────────────

const sendWeatherAlert = (token, { condition, temp, location }) =>
  sendNotification({
    token,
    title: `🌧 Weather Alert — ${location || 'Your Area'}`,
    body: `${condition}. Temperature: ${temp}°C. Take action to protect your crops.`,
    category: 'weather',
    data: { clickAction: '/weather', condition, temp: String(temp), location: location || '' },
  });

const sendMarketAlert = (token, { commodity, price, change, market }) =>
  sendNotification({
    token,
    title: `📈 Market Update — ${commodity}`,
    body: `${commodity} price is ₹${price}/quintal (${change > 0 ? '+' : ''}${change}%) at ${market}.`,
    category: 'market',
    data: { clickAction: '/market', commodity, price: String(price), change: String(change) },
  });

const sendDiseaseAlert = (token, { crop, disease, severity, reportId }) =>
  sendNotification({
    token,
    title: `🌿 Crop Disease Detected — ${crop}`,
    body: `${disease} detected on your ${crop} (Severity: ${severity}). Tap to view treatment.`,
    category: 'disease',
    data: { clickAction: '/crop-doctor', crop, disease, severity, reportId: String(reportId || '') },
  });

const sendIrrigationReminder = (token, { crop, fieldName, soilMoisture }) =>
  sendNotification({
    token,
    title: `💧 Irrigation Required — ${fieldName || 'Your Farm'}`,
    body: `Soil moisture is at ${soilMoisture}% for ${crop}. Time to irrigate!`,
    category: 'irrigation',
    data: { clickAction: '/irrigation', crop, fieldName: fieldName || '', soilMoisture: String(soilMoisture) },
  });

const sendGovernmentSchemeAlert = (token, { schemeName, deadline, benefit }) =>
  sendNotification({
    token,
    title: `🏛 Government Scheme — ${schemeName}`,
    body: `${benefit}. Apply before ${deadline}.`,
    category: 'government',
    data: { clickAction: '/schemes', schemeName, deadline, benefit },
  });

const sendPestWarning = (token, { pestName, crop, severity }) =>
  sendNotification({
    token,
    title: `🐛 Pest Warning — ${pestName}`,
    body: `High ${pestName} activity detected on ${crop} (${severity} risk). Act now!`,
    category: 'pest',
    data: { clickAction: '/pest-detection', pestName, crop, severity },
  });

const sendFertilizerReminder = (token, { crop, fertilizer, dueDate }) =>
  sendNotification({
    token,
    title: `🌱 Fertilizer Reminder — ${crop}`,
    body: `Apply ${fertilizer} to your ${crop} by ${dueDate} for optimal yield.`,
    category: 'fertilizer',
    data: { clickAction: '/fertilizer', crop, fertilizer, dueDate },
  });

const sendFarmDiaryReminder = (token, { message }) =>
  sendNotification({
    token,
    title: '📒 Farm Diary Reminder',
    body: message || 'Don\'t forget to log today\'s farm activities.',
    category: 'diary',
    data: { clickAction: '/farm-diary' },
  });

const sendAIReportReady = (token, { reportType, summary }) =>
  sendNotification({
    token,
    title: `🤖 AI Report Ready — ${reportType}`,
    body: summary || 'Your AI analysis report is ready. Tap to view.',
    category: 'ai_report',
    data: { clickAction: '/ai', reportType },
  });

module.exports = {
  sendNotification,
  sendBulkNotification,
  sendWeatherAlert,
  sendMarketAlert,
  sendDiseaseAlert,
  sendIrrigationReminder,
  sendGovernmentSchemeAlert,
  sendPestWarning,
  sendFertilizerReminder,
  sendFarmDiaryReminder,
  sendAIReportReady,
};
