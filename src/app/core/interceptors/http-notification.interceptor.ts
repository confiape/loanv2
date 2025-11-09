// import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { tap, catchError } from 'rxjs/operators';
// import { throwError } from 'rxjs';
// import { ToastService } from '../services/toast.service';
//
// /**
//  * HTTP Interceptor that shows toast notifications for:
//  * - HTTP errors (any error response)
//  * - Success messages for write operations (POST, PUT, PATCH, DELETE)
//  *
//  * Error responses should include a 'message' field.
//  * If no 'message' field is present, a generic error message is shown.
//  */
// export const httpNotificationInterceptor: HttpInterceptorFn = (req, next) => {
//   const toastService = inject(ToastService);
//   const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
//   const isWriteOperation = writeMethods.includes(req.method.toUpperCase());
//
//   return next(req).pipe(
//     tap((event) => {
//       // Show success message for successful write operations
//       if (event.type === 4 && isWriteOperation) {
//         // type 4 = HttpEventType.Response
//         toastService.success('Operación realizada con éxito');
//       }
//     }),
//     catchError((error: HttpErrorResponse) => {
//       // Extract error message from response
//       let errorMessage = 'Ha ocurrido un error inesperado';
//
//       if (error.error && typeof error.error === 'object' && 'message' in error.error) {
//         errorMessage = error.error.message;
//       } else if (error.message) {
//         // Fallback to error.message if available
//         errorMessage = error.message;
//       }
//
//       // Show error toast
//       toastService.error(errorMessage, `Error ${error.status || ''}`);
//
//       // Re-throw the error so it can be handled by the caller
//       return throwError(() => error);
//     }),
//   );
// };
