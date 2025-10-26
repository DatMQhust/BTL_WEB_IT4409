const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema } = mongoose;

/**
 * Helper function to validate ISBN-10 or ISBN-13 format.
 * This is a basic format validation; it does not perform checksum verification.
 * @param {string} isbn The ISBN string to validate.
 * @returns {boolean} True if the ISBN format is valid, false otherwise.
 */
const validateISBN = (isbn) => {
  if (!isbn) return true; // Allow optional field to pass validation
  // Regex for ISBN-10 or ISBN-13 format. We remove hyphens/spaces before testing.
  const cleanIsbn = String(isbn).replace(/[-\s]/g, '');
  const isbn10Pattern = /^\d{9}[\dX]$/i; // 9 digits followed by a digit or X
  const isbn13Pattern = /^\d{13}$/; // 13 digits
  return isbn10Pattern.test(cleanIsbn) || isbn13Pattern.test(cleanIsbn);
};

/**
 * Defines the Mongoose schema for a Product, specifically tailored for a book.
 * Includes fields for book details, pricing, inventory, and SEO-friendly slug.
 */
const productSchema = new Schema(
  {
    /**
     * The main title of the book.
     */
    title: {
      type: String,
      required: [true, 'A book must have a title.'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long.'],
      maxlength: [200, 'Title cannot exceed 200 characters.'],
    },
    /**
     * A URL-friendly slug generated from the title. Used for clean URLs.
     */
    slug: {
      type: String,
      unique: true,
    },
    /**
     * An array of authors for the book.
     */
    author: {
      type: [String], // Allows multiple authors
      required: [true, 'A book must have at least one author.'],
      set: (authors) => Array.isArray(authors) ? authors.map(author => author.trim()) : authors, // Trim each author name
      minlength: [1, 'A book must have at least one author.'], // Cleaner validation
    },
    /**
     * The publisher of the book.
     */
    publisher: {
      type: String,
      trim: true,
      maxlength: [100, 'Publisher name cannot exceed 100 characters.'],
    },
    /**
     * A detailed description of the book.
     */
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters.'],
    },
    /**
     * The price of the book.
     */
    price: {
      type: Number,
      required: [true, 'A book must have a price.'],
      min: [0, 'Price cannot be negative.'],
    },
    /**
     * The currency in which the price is denominated.
     */
    currency: {
      type: String,
      enum: {
        values: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR'],
        message: '{VALUE} is not a supported currency.',
      },
      default: 'USD',
      trim: true,
    },
    /**
     * The International Standard Book Number (ISBN).
     */
    ISBN: {
      type: String,
      required: [true, 'A book must have an ISBN.'],
      unique: true,
      trim: true,
      uppercase: true,
      validate: {
        validator: validateISBN,
        message: props => `${props.value} is not a valid ISBN-10 or ISBN-13 format!`,
      },
    },
    /**
     * An array of genres associated with the book.
     */
    genre: {
      type: [String],
      set: (genres) => Array.isArray(genres) ? genres.map(genre => genre.trim()) : genres, // Trim each genre name
    },
    /**
     * The date when the book was published.
     */
    publicationDate: {
      type: Date,
    },
    /**
     * The current quantity of this book in stock.
     */
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required.'],
      min: [0, 'Stock quantity cannot be negative.'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: props => `${props.value} is not an integer for stock quantity.`,
      },
    },
    /**
     * URL to the cover image of the book.
     */
    coverImage: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Optional field is valid if empty
          try {
            new URL(v);
            return true;
          } catch (error) {
            return false;
          }
        },
        message: props => `${props.value} is not a valid URL for cover image.`,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const slugifyOptions = {
  lower: true,
  strict: true,
  remove: /[*+~.()'!:@]/g,
};

/**
 * Middleware to generate and ensure a unique slug before saving a new document.
 */
productSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('title')) {
    const baseSlug = slugify(this.title, slugifyOptions);
    let slug = baseSlug;
    let counter = 1;
    // Check for collisions and append a counter if necessary
    while (await this.constructor.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

/**
 * Middleware to update the slug if the title is changed via findOneAndUpdate.
 */
productSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  const newTitle = update.$set?.title;

  if (newTitle) {
    const baseSlug = slugify(newTitle, slugifyOptions);
    let slug = baseSlug;
    let counter = 1;
    
    // Find the document being updated to exclude it from the uniqueness check
    const docToUpdate = await this.model.findOne(this.getQuery());

    // Check for collisions with other documents
    while (await this.model.findOne({ slug, _id: { $ne: docToUpdate._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    update.$set.slug = slug;
  }
  next();
});

// Compound index for common filtering/sorting operations
productSchema.index({ price: 1, stockQuantity: -1 });

// Full-text search index for relevant text fields
productSchema.index({
  title: 'text',
  author: 'text',
  description: 'text',
  genre: 'text',
  publisher: 'text',
}, {
  name: 'text_search_index',
  weights: {
    title: 10,
    author: 7,
    description: 5,
    genre: 3,
    publisher: 3,
  },
});


/**
 * @typedef Product
 */
module.exports = mongoose.model('Product', productSchema);