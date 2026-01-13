// create test-db.js
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../src/models/Post.js');

async function checkPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const posts = await Post.find({}).populate('author', 'displayName');
    
    console.log(`Total posts in database: ${posts.length}`);
    console.log('\nAll posts:');
    posts.forEach((post, index) => {
      console.log(`\n[${index + 1}] ${post.title}`);
      console.log(`  Slug: ${post.slug}`);
      console.log(`  Published: ${post.isPublished}`);
      console.log(`  Published At: ${post.publishedAt}`);
      console.log(`  Author: ${post.author?.displayName || 'Unknown'}`);
      console.log(`  Tags: ${post.tags.map(t => `${t.name} (${t.type})`).join(', ')}`);
    });
    
    // Also check query with isPublished condition
    const publishedPosts = await Post.find({ isPublished: true });
    console.log(`\nPublished posts: ${publishedPosts.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPosts();