const jwt = require("jsonwebtoken");

const handleToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check for the "Bearer " prefix in the token
  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Remove the "Bearer " prefix to get the actual token
  const bearerToken = token.slice(7);

  jwt.verify(bearerToken, "Bearar", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid Token" });
    }
    req.user = user;

    req.loggedInUserData = {
      name: user.name || "",
      refId: user.refId || user._id || "",
      refType: user.refType || "Administrative",
      empCode: user.employeeCode || "", // ✅ this is what fixes your receipt!
    };
    next();
  });
};

module.exports = {
  handleToken,
};
