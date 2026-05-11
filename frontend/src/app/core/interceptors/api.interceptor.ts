import { HttpInterceptorFn } from '@angular/common/http';
import { getApiUrl } from '../utils/config';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = getApiUrl();
  
  if (req.url.startsWith('/v1')) {
    const apiReq = req.clone({
      url: `${apiUrl}${req.url}`
    });
    return next(apiReq);
  }
  
  return next(req);
};
