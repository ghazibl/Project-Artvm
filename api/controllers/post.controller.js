import ProductUser from '../models/post.model.js';

export const createPost = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the request body

    const { user, title, image, category, height, width, quantity, content, status } = req.body;

    const newPost = new ProductUser({
      user,
      title,
      image: image || 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
      category: category || 'uncategorized',
      height,
      width,
      quantity,
      content,
      status,
    });

    const savedPost = await newPost.save();
    console.log("Saved post:", savedPost);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error.message);
    console.error('Error details:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'An unexpected error occurred.',
      error: error.message,
    });
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await ProductUser.find().populate("user");
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await ProductUser.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePostById = async (req, res, next) => {
  try {
    const updatedPost = await ProductUser.findByIdAndUpdate(req.params.postId, req.body, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const deletePostById = async (req, res, next) => {
  try {
    const deletedPost = await ProductUser.findByIdAndDelete(req.params.postId);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
