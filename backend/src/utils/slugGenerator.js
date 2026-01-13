const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

const generateUniqueSlug = async (Model, title, existingSlug = null) => {
  let slug = slugify(title);
  let counter = 1;
  let originalSlug = slug;

  while (true) {
    const existingDoc = await Model.findOne({ slug, _id: { $ne: existingSlug } });
    
    if (!existingDoc) {
      return slug;
    }
    
    slug = `${originalSlug}-${counter}`;
    counter++;
  }
};

module.exports = { slugify, generateUniqueSlug };