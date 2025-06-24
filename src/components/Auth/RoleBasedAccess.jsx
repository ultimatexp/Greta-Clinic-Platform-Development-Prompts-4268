import React from 'react';
import useStore from '../../store/useStore';

const RoleBasedAccess = ({ allowedRoles, children, fallback = null }) => {
  const { user } = useStore();
  
  if (!user) {
    return fallback;
  }
  
  if (allowedRoles.includes(user.role)) {
    return children;
  }
  
  return fallback;
};

export default RoleBasedAccess;