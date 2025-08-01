import { Injectable } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private loadingService: LoadingService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipLoading = req.headers.get('skipLoading');
  
    if (!skipLoading) {
      this.loadingService.show();
    }
  
    const modifiedReq = req.clone({
      headers: req.headers.delete('skipLoading')
    });
  
    return next.handle(modifiedReq).pipe(
      finalize(() => {
        if (!skipLoading) {
          this.loadingService.hide();
        }
      })
    );
  }
  
}
