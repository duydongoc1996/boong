import PostModule from './post/post.module';

export const MODULES = [PostModule];

export const ROUTERS = MODULES.map((module) =>
	module.controllers.map((controller) => controller.getRouter()),
);
