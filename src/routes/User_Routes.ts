import express from "express";
const  router  = express.Router();
import { 
  Get_All_User,
  Get_Single_User
} from "../controller/User_Controller";

router.get("/All", Get_All_User);

router.get("/Single/:email", Get_Single_User);

export default router;
