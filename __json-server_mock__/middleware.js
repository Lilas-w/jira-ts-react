module.exports = (req, res, next) => {
  //捕获刚刚的login请求
  if (req.method === "POST" && req.path === "/login") {
    if (req.body.username === "jack" && req.body.password === "123456") {
      return res.status(200).json({
        user: {
          token: "123",
        },
      });
    } else {
      //请求错误
      return res.status(400).json({ message: "用户名或密码错误" });
    }
  }
  //继续
  next();
};
