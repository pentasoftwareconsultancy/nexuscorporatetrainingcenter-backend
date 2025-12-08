import express from "express";
import {
  register,
  login,
  changePassword,
  forgotPassword,
  verifyRecoveryAnswer,
  resetPassword,
  getAllUsers
} from "../../controllers/users/auth.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { authorizRole } from "../../middlewares/roleMiddleware.js";
import { pagination } from "../../middlewares/pagination.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);       // Step 1
router.post("/forgot-password/verify", verifyRecoveryAnswer); // Step 2
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);
router.get("/users", pagination, getAllUsers);

 //Role-based routes
 router.get("/admin", protect, authorizRole("admin"), (req, res) => {
   res.status(200).json({ message: "Welcome Admin!" });
 });

 router.get("/user", protect, authorizRole("user", "admin"), (req, res) => {
   res.status(200).json({ message: "Welcome user!" });
 });


export default router;



// import express from "express";

// import { protect } from "../../middlewares/auth.middleware.js";
// import { authorizRole } from "../../middlewares/roleMiddleware.js";
// import {
//   changePassword,
//   forgotPassword,
//   login,
//   resetPassword,
//   signup,
// } from "../../controllers/users/auth.controller.js";

// const router = express.Router();

// router.post("/signup", signup);
// router.post("/login", login);

// // Forgot / Reset
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

// // Change password (requires login)
// router.post("/change-password", protect, changePassword);

// //Role-based routes
// router.get("/admin", protect, authorizRole("admin"), (req, res) => {
//   res.status(200).json({ message: "Welcome Admin!" });
// });

// router.get("/user", protect, authorizRole("user", "admin"), (req, res) => {
//   res.status(200).json({ message: "Welcome user!" });
// });

// router.get(
//   "/teacher",
//   protect,
//   authorizRole("admin", "user", "teacher"),
//   (req, res) => {
//     res.status(200).json({ message: "Welcome teacher!" });
//   }
// );

// export default router;
