import mongoose from "mongoose"

export interface BookingType {
  _id?: string;
  user: string | any;
  serviceProvider: string | any;
  service: string | any;
  subService: {
    name: string;
    price: number;
    priceUnit: "hour" | "day" | "job";
  };
  bookingDate: Date;
  address: {
    street?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    coordinates?: [number, number];
  };
  description: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
  paymentStatus: "pending" | "partial" | "completed" | "refunded";
  paymentMethod: "cash" | "online" | "wallet";
  estimatedPrice: number;
  finalPrice?: number;
  serviceStartTime?: Date;
  serviceEndTime?: Date;
  totalHours?: number;
  cancellationReason?: string;
  cancelledBy?: "user" | "provider" | "admin";
  isReviewed: boolean;
  review?: string | any;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: [true, "Service provider is required"],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required"],
    },
    subService: {
      name: String,
      price: Number,
      priceUnit: {
        type: String,
        enum: ["hour", "day", "job"],
        default: "hour",
      },
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    address: {
      street: String,
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
      },
      landmark: String,
      coordinates: {
        type: [Number],
        default: [0, 0],
      }
    },
    description: {
      type: String,
      required: [true, "Description of work is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled", "no-show"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "completed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online", "wallet"],
      default: "cash",
    },
    estimatedPrice: {
      type: Number,
      required: [true, "Estimated price is required"],
    },
    finalPrice: {
      type: Number,
    },
    serviceStartTime: {
      type: Date,
    },
    serviceEndTime: {
      type: Date,
    },
    totalHours: {
      type: Number,
    },
    cancellationReason: {
      type: String,
    },
    cancelledBy: {
      type: String,
      enum: ["user", "provider", "admin"],
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
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
  },
)

const Booking = mongoose.models?.Booking || mongoose.model("Booking", bookingSchema)

export default Booking
