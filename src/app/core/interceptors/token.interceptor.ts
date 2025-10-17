import { HttpInterceptorFn } from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = 'Bearer fake-token-12345'; 

  const cloned = req.clone({
    setHeaders: {
      Authorization: token
    }
  });

  return next(cloned);
};
