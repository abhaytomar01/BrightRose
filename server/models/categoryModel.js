const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  position: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Category', categorySchema);
