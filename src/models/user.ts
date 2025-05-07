import mongoose, { Model } from "mongoose";

// Define the interface for the User document
interface IUser {
  name?: string;
  email?: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
  };
  profileImage?: string;
  role: "user" | "admin";
  isActive: boolean;
  bookings: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: false,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please provide a valid phone number"],
    },
    address: {
      street: String,
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: String,
      },
      landmark: String,
    },
    profileImage: {
      type: String,
      default: "/placeholder.svg",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model exists before creating a new one
const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);

export default User;