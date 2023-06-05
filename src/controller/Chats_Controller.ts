import prisma from "../prisma";

const Get_All_Chats = async (req: any, res: any) => {
  try {
    const Chats = await prisma.chats.findMany();
    if (!Chats) return res.status(404).json({ message: "User not found!" });
    return res.status(200).json({ message: "Success", data: Chats });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.warn(err);
  }
};

const Get_Single_Chats = async (req: any, res: any) => {
  try {
    const { email } = req.params;
    if (!email)
      return res
        .status(404)
        .json({ message: "email Not Found! OR Not valid email " });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.warn(err);
  }
};

export { Get_All_Chats, Get_Single_Chats };
