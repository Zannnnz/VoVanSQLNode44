import express from 'express';
import userRoutes from './user.router.js';
import videoRoutes from './video.router.js';

const rootRoutes = express.Router();

rootRoutes.use("/users",userRoutes);
rootRoutes.use("/video",videoRoutes);


export default rootRoutes;