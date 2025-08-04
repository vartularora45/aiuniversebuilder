import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        length : [20, "Email cannot be more than 20 characters"],
        required: true,
        unique: true,
        RegExp : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    passwordHash: {
        type: String,
        required: true,
        length : [8, "Password must be at least 8 characters long"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        default: null,

    },
    


})

const User = mongoose.model("User", userSchema);
export default User;