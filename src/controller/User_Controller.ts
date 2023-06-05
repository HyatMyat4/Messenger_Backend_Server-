import prisma from "../prisma";

interface Response {
  message: string;
  data: _data;
  status: any;
}

interface _data {
  BackgroundImage: string;
  Chats: [];
  Friends: [];
  Intro: string;
  LivesIn: string;
  Name: string;
  ProfileImage: string;
  Profile_Love: [];
  Single: boolean;
  createdAt: string;
  email: string;
  id: string;
  updatedAt: string;
}

const Get_All_User = async (req: any, res: Response | any) => {
  try {
    const users = await prisma.user.findMany();
    if (!users)
      return res
        .status(404)
        .json({ message: " Something wroung user not found!" });
    for (var obj of users) {
      delete obj.Password;
    }
    return res.status(200).json({ message: "Success", data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.warn(err);
  }
};

const Get_Single_User = async (req: any, res: Response | any) => {
  try {
    const { email } = req.params;
    if (!email)
      return res
        .status(404)
        .json({ message: "email Not Found! OR Not Valid email " });
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) return res.status(404).json({ message: "User Not Found!" });
    delete user.Password;
    return res.status(200).json({ message: "Success", data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.warn(err);
  }
};

export { Get_All_User, Get_Single_User };
