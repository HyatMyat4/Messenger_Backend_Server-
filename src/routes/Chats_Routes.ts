import express from "express";
const  router = express.Router();
import {
  Get_All_Chats,
  Get_Single_Chats,
} from "../controller/Chats_Controller";

router.post("/", Get_All_Chats);

router.post("/:email", Get_Single_Chats);

export default router;
