import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
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
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required"],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [500, "Comment cannot be more than 500 characters"],
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

// Prevent duplicate reviews for the same booking
reviewSchema.index({ booking: 1 }, { unique: true })

// After saving a review, update the service provider's rating
reviewSchema.post("save", async function () {
  try {
    const ServiceProvider = mongoose.model("ServiceProvider")
    const provider = await ServiceProvider.findById(this.serviceProvider)

    if (provider) {
      // Calculate new average rating
      const totalRating = provider.rating * provider.totalReviews;
      const newTotalRating = totalRating + this.rating;
      const newTotalReviews = provider.totalReviews + 1; 
      const newRating = newTotalRating / newTotalReviews;

      // Update provider
      await ServiceProvider.findByIdAndUpdate(this.serviceProvider, {
        rating: newRating,
        totalReviews: newTotalReviews,
        $push: { reviews: this._id },
      })
    }

    // Update booking to mark as reviewed
    const Booking = mongoose.model("Booking")
    await Booking.findByIdAndUpdate(this.booking, {
      isReviewed: true,
      review: this._id,
    })
  } catch (error) {
    console.error("Error updating service provider rating:", error)
  }
})

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema)

export default Review;
