import mongoose from "mongoose"

export interface ServiceProviderType {
    _id?: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    profileImage: string;
    profession: string | any;
    experience: number;
    address: {
        street?: string;
        city: string;
        state: string;
        pincode: string;
        landmark?: string;
    };
    coordinates?: [number, number];
    availability: {
        isAvailable: boolean;
        workingDays: string[];
        workingHours: {
            start: string;
            end: string;
        };
    };
    professionalCertificates?: string[];
    isVerified: boolean;
    providerStatus: "active" | "inactive" | "suspended" | "pending";
    rating: number;
    totalReviews: number;
    totalBookings: number;
    completedBookings: number;
    bookings?: string[] | any[];
    reviews?: string[] | any[];
    bankDetails: {
        accountHolderName?: string;
        accountNumber?: string;
        ifscCode?: string;
        bankName?: string;
        branch?: string;
    };
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const serviceProviderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please provide a valid phone number"],
        },
        profileImage: {
            type: String,
            default: "/placeholder.svg",
        },
        profession: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: [true, "Profession is required"], // electrician, plumber, etc.
        },
        experience: {
            type: Number,
            required: [true, "Experience is required"],
            min: [0, "Experience cannot be negative"],
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
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
        availability: {
            isAvailable: {
                type: Boolean,
                default: true,
            },
            workingDays: {
                type: [String],
                enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            },
            workingHours: {
                start: {
                    type: String,
                    default: "09:00",
                },
                end: {
                    type: String,
                    default: "18:00",
                },
            },
        },
        professionalCertificates: [String],
        isVerified: {
            type: Boolean,
            default: false,
        },
        providerStatus: {
            type: String,
            default: "pending",
            enum: ["active", "inactive", "suspended", "pending"],
        },
        rating: {
            type: Number,
            default: 0,
            min: [0, "Rating cannot be less than 0"],
            max: [5, "Rating cannot be more than 5"],
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        totalBookings: {
            type: Number,
            default: 0,
        },
        completedBookings: {
            type: Number,
            default: 0,
        },
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking",
            },
        ],
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        bankDetails: {
            accountHolderName: {
                type: String,
                required: [true, "Account holder name is required"],
            },
            accountNumber: {
                type: String,
                required: [true, "Account number is required"],
            },
            ifscCode: {
                type: String,
                required: [true, "IFSC code is required"],
            },
            bankName: {
                type: String,
                required: [true, "Bank name is required"],
            },
            branch: {
                type: String,
                required: [true, "Branch name is required"],
            },
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        role: {
            type: String,
            default: "serviceProvider"
        },
        referralCode: {
            type: String,
            maxlength: 6,
            validate: {
                validator: function(v: string) {
                    return !v || /^[A-Z0-9]{6}$/.test(v)
                },
                message: 'Referral code must be 6 alphanumeric characters'
            }
        },
        referrer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ServiceProvider',
            default: null
        },
        referred: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ServiceProvider'
        }],
        level: {
            type: Number,
            default: 0
        },
        downline: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    },
)

serviceProviderSchema.index(
  { referralCode: 1 },
  {
    unique: true,
    partialFilterExpression: { referralCode: { $exists: true, $ne: null } }
  }
)
// Method to check if provider is available in a specific location
serviceProviderSchema.methods.isAvailableInLocation = function (userLat: number, userLng: number) {
    if (!this.coordinates || this.coordinates.length !== 2) return false;

    const [providerLng, providerLat] = this.coordinates;

    // Calculate distance using Haversine formula
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const earthRadiusKm = 6371;

    const dLat = toRadians(userLat - providerLat);
    const dLng = toRadians(userLng - providerLng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(providerLat)) * Math.cos(toRadians(userLat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;

    // Assuming a threshold of 50 km for availability
    return distance <= 10;
};

serviceProviderSchema.virtual('completionRate').get(function () {
    return this.totalBookings > 0
        ? (this.completedBookings / this.totalBookings * 100).toFixed(1)
        : 0;
});

serviceProviderSchema.methods.updateStats = async function (bookingStatus) {
    if (bookingStatus === 'completed') {
        this.completedBookings += 1;
    }
    this.totalBookings += 1;
    await this.save();
};

serviceProviderSchema.methods.updateRating = async function (rating) {
    const newTotalReviews = this.totalReviews + 1;
    const newRating = ((this.rating * this.totalReviews) + rating) / newTotalReviews;

    this.rating = Number(newRating.toFixed(1));
    this.totalReviews = newTotalReviews;
    await this.save();
};

const ServiceProvider = mongoose.models?.ServiceProvider || mongoose.model("ServiceProvider", serviceProviderSchema)

export default ServiceProvider;
