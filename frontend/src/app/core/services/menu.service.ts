import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private activeFeatureSignal = signal<string>('');
  readonly activeFeature = this.activeFeatureSignal.asReadonly();

  setActiveFeature(feature: string) {
    this.activeFeatureSignal.set(feature);
  }
}
