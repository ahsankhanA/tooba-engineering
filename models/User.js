const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address format'],
      index: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required for contact and dispatch'],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Hidden by default from queries to prevent accidental leakage
    },
    role: {
      type: String,
      enum: {
        values: ['CEO', 'ADMIN', 'TECHNICIAN', 'CUSTOMER'],
        message: '{VALUE} is not a valid role',
      },
      default: 'CUSTOMER',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    lockUntil: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify candidate password against stored bcrypt hash
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) {
    throw new Error('Password hash not selected in query');
  }
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to increment failed logins and conditionally lock account
UserSchema.methods.handleFailedLogin = async function () {
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME_MS = 15 * 60 * 1000; // 15-minute lock

  const updates = { $inc: { failedLoginAttempts: 1 } };
  if (this.failedLoginAttempts + 1 >= MAX_ATTEMPTS) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME_MS) };
  }

  await this.model('User').updateOne({ _id: this._id }, updates);
};

// Method to reset failed attempts on successful login
UserSchema.methods.handleSuccessfulLogin = async function () {
  await this.model('User').updateOne(
    { _id: this._id },
    {
      $set: {
        failedLoginAttempts: 0,
        lastLogin: new Date(),
      },
      $unset: { lockUntil: 1 },
    }
  );
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
