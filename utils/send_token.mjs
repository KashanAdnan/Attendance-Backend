const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const option = {
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(statusCode).cookie("student_token", token, option).json({
    succes: true,
    user,
    token,
  });
};
export { sendToken };
