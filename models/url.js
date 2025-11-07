import mongoose from 'mongoose'

const urlschema = new  mongoose.Schema({
    originalUrl: {
        type: String, required: true
    },
    shortCode: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
    clickHistory: [Date], // track every access time
    lastAccessed: Date,
    expiresAt: { type: Date }
}, { timestamps: true });

urlschema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });



export const Url = mongoose.model("Url",urlschema)
    
