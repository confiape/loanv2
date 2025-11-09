import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of, shareReplay, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cache = new Map<string, Observable<SafeHtml>>();
  private readonly emptyIcon = this.sanitizer.bypassSecurityTrustHtml('');

  getSvg(name: string): Observable<SafeHtml> {
    const normalizedName = this.normalizeName(name);

    if (!normalizedName) {
      return of(this.emptyIcon);
    }

    const cached = this.cache.get(normalizedName);
    if (cached) {
      return cached;
    }

    const fetch$ = this.http
      .get(`assets/icons/${normalizedName}.svg`, {
        responseType: 'text',
      })
      .pipe(
        map((svg) => this.sanitizer.bypassSecurityTrustHtml(svg)),
        tap({
          error: () => {
            console.log("wwes")
            this.cache.delete(normalizedName)
          },
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this.cache.set(normalizedName, fetch$);

    return fetch$;
  }

  private normalizeName(name: string): string {
    return name.trim().replace(/\.svg$/i, '');
  }
}
