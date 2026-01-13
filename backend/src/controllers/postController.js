const Post = require('../models/Post');
const { generateUniqueSlug } = require('../utils/slugGenerator');

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      sort = '-publishedAt',
      search 
    } = req.query;

    console.log('Query parameters:', { page, limit, category, sort, search }); // DEBUG

    // Build query
    let query = { isPublished: true };
    
    // Filter by category
    if (category) {
      query['tags.type'] = category;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const posts = await Post.find(query)
      .populate('author', 'displayName username')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    console.log(`Found ${posts.length} posts, total: ${total}`); // DEBUG

    // Format response
    const formattedPosts = posts.map(post => ({
      ...post,
      date: post.publishedAt,
      preview: post.excerpt
    }));

    res.json({
      posts: formattedPosts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalPosts: total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single post by slug
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'displayName username')
      .lean();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    await Post.findByIdAndUpdate(post._id, { $inc: { viewCount: 1 } });

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, tags, featuredImage } = req.body;

    // Generate unique slug
    const slug = await generateUniqueSlug(Post, title);

    // Create post
    const post = new Post({
      title,
      slug,
      content,
      excerpt,
      tags,
      featuredImage,
      author: req.user._id
    });

    await post.save();

    // Populate author info
    await post.populate('author', 'displayName username');

    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, excerpt, tags, featuredImage, isPublished } = req.body;

    // Find post
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    // Generate new slug if title changed
    let slug = post.slug;
    if (title && title !== post.title) {
      slug = await generateUniqueSlug(Post, title, post._id);
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: title || post.title,
        slug,
        content: content || post.content,
        excerpt: excerpt || post.excerpt,
        tags: tags || post.tags,
        featuredImage: featuredImage !== undefined ? featuredImage : post.featuredImage,
        isPublished: isPublished !== undefined ? isPublished : post.isPublished,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('author', 'displayName username');

    res.json(updatedPost);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Post.aggregate([
      { $match: { isPublished: true } },
      { $unwind: '$tags' },
      { $group: {
          _id: '$tags.type',
          count: { $sum: 1 },
          name: { $first: '$tags.type' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Format categories with display names
    const nameMap = {
      'essays': 'Essays',
      'design': 'Design',
      'tattoo': 'Tattoo',
      'painting': 'Painting',
      'photography': 'Photography',
      'audio': 'Audio',
      'av': 'Audio/Visual',
      'resources': 'Resources'
    };

    const formattedCategories = categories.map(cat => ({
      id: cat._id,
      name: nameMap[cat._id] || cat._id,
      type: cat._id,
      count: cat.count
    }));

    res.json(formattedCategories);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};