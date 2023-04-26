import Router from '@koa/router';
import homeController from '../controllers/home.controller';
import auth from "../controllers/auth"
import userinfo from "../controllers/userinfo"
import { userChange } from "../controllers/sync"
import pingController from '../controllers/ping.controller';
import forwardsController from '../controllers/forwards.controller';

export const router = new Router();

export const buildRoutes = () => {
  [
    homeController,
    auth,
    userinfo,
    userChange,
    pingController,
    forwardsController,
  ].forEach((controller) => {
    controller(router);
  });
};
