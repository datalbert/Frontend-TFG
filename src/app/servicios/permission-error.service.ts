import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PermissionErrorService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  showPermissionError(): Promise<void> {
    return this.http.get('assets/permission-error.html', { responseType: 'text' }).toPromise()
      .then(htmlContent => {
        const sanitizedHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent as string);
        const overlay = document.createElement('div');
        overlay.innerHTML = htmlContent as string;
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        overlay.style.color = '#fff';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';
        overlay.style.overflow = 'auto'; // Ensures it can scroll if content is too long
        document.body.appendChild(overlay);

        return new Promise<void>(resolve => {
          const closeButton = overlay.querySelector('#ok-button');
          if (closeButton) {
            closeButton.addEventListener('click', () => {
              document.body.removeChild(overlay);
              resolve();
            });
          } else {
            setTimeout(() => {
              document.body.removeChild(overlay);
              resolve();
            }, 20000); // Adjust timeout as needed
          }
        });
      });
  }
}
