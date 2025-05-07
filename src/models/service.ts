import mongoose from "mongoose"

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Service slug is required"],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    icon: {
      type: String,
      default: "Wrench",
    },
    image: {
      type: String,
      default: "/placeholder.svg",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subServices: [
      {
        name: {
          type: String,
          required: [true, "Sub-service name is required"],
        },
        description: String,
        basePrice: {
          type: Number,
          required: [true, "Base price is required"],
        },
        priceUnit: {
          type: String,
          enum: ["hour", "day", "job"],
          default: "hour",
        },
      },
    ],
    providers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider",
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
  },
)

// Create slug from name before saving
serviceSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next()

  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")

  next()
})

const Service = mongoose.models?.Service || mongoose.model("Service", serviceSchema)

export default Service
