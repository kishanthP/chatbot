const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

/**
 * GET /api/auth/me
 * Returns the current authenticated user's profile.
 * Used by the client to fetch user info after login.
 */
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email,
    phone: req.user.phone,
    name: req.user.name,
  });
});

module.exports = router;
