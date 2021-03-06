import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class LocalStorage {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {}

  setItem(key: string, value: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}
