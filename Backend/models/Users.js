const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensure emails are unique
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', // Default profile picture URL
        },
        aboutMe: {
            type: String,
            default: '',
            maxlength: 500,
        },
        skillsOffered: [
            {
                type: String, // Array of strings, e.g., ['Web Development', 'Math Tutoring']
            },
        ],
        skillsNeeded: [
            {
                type: String, // Array of strings
            },
        ],
        location: { // Could be a city, neighborhood, or a custom string
            type: String,
            required: true,
        },
        // For reputation/feedback later
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
    }
);

// Pre-save hook to hash password before saving a new user or updating password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { // Only hash if password field is new or modified
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
