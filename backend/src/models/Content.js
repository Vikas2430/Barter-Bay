const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['page', 'post', 'announcement'],
        default: 'post'
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    featuredImage: {
        type: String
    },
    tags: [{
        type: String
    }],
    meta: {
        description: String,
        keywords: String
    },
    seo: {
        title: String,
        description: String,
        canonicalUrl: String
    }
}, {
    timestamps: true
});

// Create index for search
contentSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Content', contentSchema); 