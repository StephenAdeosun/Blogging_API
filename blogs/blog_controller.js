const BlogModel = require('../model/BlogModel')
const jwt = require('jsonwebtoken')
const UserModel = require('../model/UserModel')
require('dotenv').config()

function calculateReadingTime(content) {
  // Define an average reading speed in words per minute (adjust as needed)
  const wordsPerMinute = 200;

  // Count the number of words in the content
  const wordCount = content.split(/\s+/).length;

  // Calculate the estimated reading time in minutes
  const readingTimeMinutes = wordCount / wordsPerMinute;

  return readingTimeMinutes;
}

const CreateBlog = async (req, res) => {
  try {
    const blogFromReq = req.body;

    const existingBlog = await BlogModel.findOne({ title: blogFromReq.title });
    if (existingBlog) {
      return res.status(409).json({
        success: false,
        message: 'Blog with this title already exists',
      });
    }

    // Calculate the estimated reading time using the function
    const readingTime = calculateReadingTime(blogFromReq.body);

    const blog = await BlogModel.create({
      title: blogFromReq.title,
      body: blogFromReq.body,
      description: blogFromReq.description,
      state: blogFromReq.state,
      author: { id: req.user._id, name: req.user.first_name },
      tags: blogFromReq.tags,
      reading_time: readingTime, // Set the estimated reading time
    });

    if (blog) {
      return res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        data: { blog },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// const CreateBlog = async (req, res) => {
//     try {
//         const blogFromReq = req.body

//         const existingBlog = await BlogModel.findOne({ title: blogFromReq.title })
//         if (existingBlog) {
//             return res.status(409).json({
//                 success: false,
//                 message: 'Blog with this title already exists',
//             })
//         }

//         const blog = await BlogModel.create({
//             title: blogFromReq.title,
//             body: blogFromReq.body,
//             description: blogFromReq.description,
//             state: blogFromReq.state,
//             author: { id: req.user._id, name: req.user.first_name},
//             tags: blogFromReq.tags,
//         })


//         if (blog) {
//             return res.status(201).json({
//                 success: true,
//                 message: 'Blog created successfully',
//                 data: { blog }
//             })
//         }

//     }
//     catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         })
//     }
// }

// get published blogs only
const GetBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.find({ state: 'published' })
        if (blogs) {
            return res.status(200).json({
                success: true,
                message: 'Blogs fetched successfully',
                data: { blogs }
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const UpdateBlogState = (async (req, res) => {
    const blogId = req.params.id
    const userId = req.user._id
    const blog = await BlogModel.findById(blogId)
    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
    }

    if (!blog.author || !blog.author.id) {
        return res.status(400).json({ message: 'Invalid blog author information' });
      }
    if (blog.author.id.toString() !== userId) {
        return res.status(403).json({ message: 'You are not the author of this blog' });
    }


    // Update the state
    const newState = req.body.state;
    blog.state = newState;

    // Save the updated blog
    await blog.save();

    return res.status(200).json({ message: 'Blog state updated successfully' });

})


const UpdateBlog = (async (req, res) => {
    const blogId = req.params.id
    const userId = req.user._id
    const blog = await BlogModel.findById(blogId)
    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.id.toString() !== userId) {
        return res.status(403).json({ message: 'You are not the author of this blog' });
    }

    // Update the state
    if (req.body.title) {
        blog.title = req.body.title;
      }
      if (req.body.description) {
        blog.description = req.body.description;
      }
      if (req.body.tags) {
        blog.tags = req.body.tags;
      }
      if (req.body.body) {
        blog.body = req.body.body;
      }
      if (req.body.state) {
        blog.state = req.body.state;
      }

    // Save the updated blog
    await blog.save();

    return res.status(200).json({ message: 'Blog updated successfully' });
})


const DeleteBlog = (async (req, res) => {
    const blogId = req.params.id
    const userId = req.user._id
    // console.log(userId)
    const blog = await BlogModel.findById(blogId)
    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
    }
    if(blog.author.id.toString() !== userId){
        console.log(blog.author.id.toString())
        return res.status(403).json({ message: 'You are not the author of this blog' });
    }
        try{
            await BlogModel.findByIdAndDelete(blogId);
            return res.status(200).json({ message: 'Blog deleted successfully' });
        }catch(error){
            console.log(error)
            return res.status(500).json({ message: 'Something went wrong' });
        }

})


// The owner of the blog should be able to get a list of their blogs. 
// The endpoint should be paginated
// It should be filterable by state

const GetBlogByAuthor = async (req, res) => {
    try {
        const userId = req.user._id;
        // Pagination parameters (page and limit)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // State filter parameter
        const state = req.query.state;
    
        // Create a query object for Mongoose
        const query = {
            'author.id': userId, 
          };
    
        if (state) {
          query.state = state;
        }
    
        // Retrieving the owner's blogs with pagination and state filtering
        const blogs = await BlogModel.find(query)
          .skip(skip)
          .limit(limit);

    
        if (!blogs || blogs.length === 0 && state) {
          return res.status(404).json({ message: `No ${state} blogs  found for the user` });
        }
        if (!blogs || blogs.length === 0) {
          return res.status(404).json({ message: `No  blogs found for the user` });
        }

        return res.status(200).json({ blogs });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }

}

const GetAllBlogs = (async (req, res) => {
    try {
        // Pagination parameters (page and limit)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
    
        // Search parameters (author, title, tags)
        const author = req.query.author;
        const title = req.query.title;
        const tags = req.query.tags;
    
        // Ordering parameters (order and sortDirection)
        const order = req.query.order || 'timestamp'; // Default to sorting by timestamp
        const sortDirection = req.query.sortDirection || 'desc'; // Default to descending order
    
        const sortOptions = {};
        sortOptions[order] = sortDirection === 'asc' ? 1 : -1;
    
        // Build the query object for filtering
        const query = {};
        query.state = 'published'; // Only retrieve published blogs
    
        if (author) {
          query['author.name'] = author; // Assuming author name is stored in the blog document as author.name
        }
    
        if (title) {
          query.title = new RegExp(title, 'i'); // Case-insensitive search
        }
    
        if (tags) {
          query.tags = { $in: tags.split(',') }; 
        }
    
        // Retrieve blogs with pagination, search, and ordering
        const blogs = await BlogModel.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit);
        if (!blogs || blogs.length === 0) {
          return res.status(404).json({ message: 'No blogs found' });
        }
        return res.status(200).json({ blogs });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
});



const GetSingleBlog = async (req, res) => {
    try {
    //   const userId = req.user._id; // Assuming the user's ID is extracted from the JWT
      const blogId = req.params.id; // Assuming the blog ID is provided in the URL
  
      // Retrieve the requested blog
      const blog = await BlogModel.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      // Update the read_count of the blog by 1
      blog.read_count += 1;
      await blog.save();
  
      // Retrieve the user information (author) for the blog
      const author = await UserModel.findById(blog.author.id); // Assuming UserModel represents the user model
  
      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }
  
      // Return the blog and author information
      return res.status(200).json({ blog });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

module.exports = {
    CreateBlog,
    GetBlogs,
    UpdateBlogState,
    UpdateBlog,
    DeleteBlog,
    GetBlogByAuthor,
    GetAllBlogs,
    GetBlogById: GetSingleBlog

}