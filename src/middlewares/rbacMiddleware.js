const { getPermissionsByRoleName } = require('../utils/permissionUtils');
const AppError = require("../utils/appError");


const checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user ? req.user.role : 'anonymous';
    // console.log(req.user)
    const userPermissions = getPermissionsByRoleName(userRole);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      // return res.status(403).json({ error: 'Access denied' });
      throw new AppError('access denied', 400);
    }
  };
};

module.exports = {
  checkPermission,
};
