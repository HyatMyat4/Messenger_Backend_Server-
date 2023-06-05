import prisma from "../prisma";
const Get_Search_User = async (req: any, res: any) => {
  try {
    const { Search_query } = req.params;
    if (!Search_query)
      return res.status(404).json({ message: "Search_query Not Found!" });
    const users = await prisma.user.findMany({
      where: {
        Name: {
          startsWith: Search_query,
        },
      },
    });
    console.log(users, "users");
    if (!users) return res.status(404).json({ message: "User Not Found!" });
    for (var obj of users) {
      delete obj.Password;
    }
    return res.status(200).json({ message: "Success", data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.warn(err);
  }
};

export { Get_Search_User };
