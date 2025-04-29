const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        required: true,
        default: 'My Site'
    },
    siteDescription: {
        type: String,
        default: ''
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    allowRegistration: {
        type: Boolean,
        default: true
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    theme: {
        type: String,
        default: 'light'
    },
    socialLinks: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String
    },
    contactEmail: {
        type: String,
        default: ''
    },
    analytics: {
        googleAnalyticsId: String,
        facebookPixelId: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema); 