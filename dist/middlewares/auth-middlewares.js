"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// function authMiddleware(req: Request, res: Response, next: NextFunction) {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).send({ error: 'Unauthorized' });
//   }
//   try {
//     const decoded: any = jwt.verify(token, process.env.jwt_secret);
//     req.userId= decoded.id;
//     next();
//   } catch (error) {
//     return res.status(401).send({ error: 'Unauthorized' });
//   }
// }
// export default authMiddleware;
// export const userAuthorization = async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers?.authorization?.split(" ")[1];
//     // if (!token) return next(ErrorResponse.unauthorized("Unauthorized"));
//     // verify token
//     let decode;
//     try {
//       decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     } catch (err) {
//       return next(ErrorResponse.forbidden("Forbidden"));
//     }
//     if (!decode.data.email || !decode.data.id)
//       return next(ErrorResponse.forbidden("Forbidden"));
//     req.userData = decode.data;
//     return next();
//   };
