export const mongooseError = (error: any, _: any, next: any) => {
  error.status = 400;
  next();
};
