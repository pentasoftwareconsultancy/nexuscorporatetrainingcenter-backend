import Course from "../models/course.model.js";
import Category from "../models/category.model.js";

export const createCourse = async(req, res) => {
  try{
    //const {course_name, category_id, title, description }
    const course = await Course.create(req.body);
    console.log(course)
    res.json(course)
  }catch(err){
    res.status(500).json({ error: err.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
       include: [{ model: Category, as: 'category' }] 
  }); 

  //  const category = await Category.findAll({
  //      include: [{ model: Course, as: 'course' }] 
  // });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a course by ID
export const getCourseById = async (req, res) => {
  try {
    const {course_id} = req.params;
    const course = await Course.findByPk(course_id, { // select * from course where course_id =?
      include: [{ model: Category, as: 'category' }]
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const {course_id} = req.params;

    // ✅ Ensure we're receiving a plain JSON object
    if (Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Request body should be a JSON object, not an array' });
    }

    console.log('Incoming update data:', req.body); // Debugging

    // ✅ Find the course
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // ✅ Update fields explicitly (safe and controlled)
    const updatedCourse = await course.update({
      course_name: req.body.course_name ?? course.course_name,
      category_id: req.body.category_id ?? course.category_id,
      title: req.body.title ?? course.title,
      description: req.body.description ?? course.description,
      instructor_name: req.body.instructor_name ?? course.instructor_name,
      duration: req.body.duration ?? course.duration,
      fees: req.body.fees ?? course.fees,
      contact: req.body.contact ?? course.contact,
      what_you_learn: req.body.what_you_learn ?? course.what_you_learn,
      syllabus: req.body.syllabus ?? course.syllabus,
      image_url: req.body.image_url ?? course.image_url,
      is_active: req.body.is_active ?? course.is_active,
    });

    // ✅ Return the updated object
    return res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const {course_id} = req.params;
    const course = await Course.findByPk(course_id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Extra: Get all active courses
export const getActiveCourses = async (req, res) => {
  try {
    
    const activeCourses = await Course.findAll({ where: { is_active: true } });
    console.log(activeCourses);
    res.json(activeCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Extra: Get courses by Category ID
export const getCoursesByCategory = async (req, res) => {
  try {
    const {course_id} = req.params;
    const courses = await Course.findAll({
      where: { category_id: req.params.category_id },
      include: [{ model: Category, as: 'category' }]
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};