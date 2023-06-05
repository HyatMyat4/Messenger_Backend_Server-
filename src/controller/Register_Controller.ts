import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Register = async (req: any, res: any) => {
  try {
    const data = req.body;

    if (!data) return res.status(404).json({ message: " 404 data Not Found!" });

    const duplicate_Name = await prisma.user.findUnique({
      where: {
        Name: data.name,
      },
    });
    const duplicate_Email = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (duplicate_Name)
      return res.status(200).json({ message: "Duplicate UserName!" });
    if (duplicate_Email)
      return res.status(200).json({ message: "Duplicate Email!" });

    // Hash password
    const hashedPwd = await bcrypt.hash(data.Pasword, 12); // salt rounds

    const createUser = await prisma.user.create({
      data: {
        email: data.email,
        Name: data.name,
        ProfileImage: data.image,
        BackgroundImage: "",
        Password: hashedPwd,
        Intro: "",
        Single: true,
        LivesIn: "",
        Profile_Love: [],
        Friends: [],
        Chats: [],
      },
    });

    if (createUser) {
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: createUser.Name,
            email: createUser.email,
            ProfileImage: createUser.ProfileImage,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { username: createUser.Name },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      // Create secure cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: "None", //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
      });

      return res
        .status(201)
        .json({ message: `Success Create User`, Token: accessToken });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.warn(err);
  }
};

const Log_in = async (req: any, res: any) => {
  try {
    const { email, Pasword } = req.body;
    if (!email || !Pasword) {
      return res
        .status(404)
        .json({ message: " email and password Not Found!" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) return res.status(404).json({ message: "Unauthorized" });

    const match = await bcrypt.compare(Pasword, user.Password);

    if (!match)
      return res.status(401).json({ message: "Not a Valid Password!" });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: user.Name,
          email: user.email,
          ProfileImage: user.ProfileImage,
        },
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    const refreshToken = jwt.sign(
      { username: user.Name },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    return res
      .status(200)
      .json({ message: "Success Login", Token: accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.warn(err);
  }
};

const logout = (req: any, res: any) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Success Cookie cleared" });
};

export { Register, Log_in, logout };
