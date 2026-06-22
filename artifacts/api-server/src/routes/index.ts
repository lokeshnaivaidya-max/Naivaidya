import { Router, type IRouter } from "express";
import adminRouter from "./admin";
import healthRouter from "./health";
import waitlistRouter from "./waitlist";

const router: IRouter = Router();

router.use(healthRouter);
router.use(waitlistRouter);
router.use(adminRouter);

export default router;
