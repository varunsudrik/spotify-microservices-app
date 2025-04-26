import axios from "axios";
import "dotenv/config";

export const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(403).json({
        message: "Please Login",
      });
    }
    let { data } = await axios.get(`${process.env.USER_URL}/api/v1/user/me`, {
      headers: {
        token: `${token}`,
      },
    });

    req.user = data;
    next();
  } catch (error) {
    console.log("error in admin auth", error.message);
    return res.status(403).json({
      message: "Please Login",
    });
  }
};
