import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, User } from './auth.service';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: any;

  const mockUser: User = { id: '1', email: 'test@email.com', name: 'Test' };

  beforeEach(() => {
    routerMock = { navigate: vi.fn() };
    
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login correctly and save to localStorage', () => {
    service.login('atoken', 'rtoken', mockUser);
    
    expect(localStorage.getItem('token')).toBe('atoken');
    expect(localStorage.getItem('refreshToken')).toBe('rtoken');
    expect(service.user()).toEqual(mockUser);
    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should logout and clear localStorage', () => {
    service.login('atoken', 'rtoken', mockUser);
    service.logout();
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(service.user()).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check auth and update user', async () => {
    localStorage.setItem('token', 'atoken');
    
    const checkPromise = service.checkAuth();
    
    const req = httpMock.expectOne('/v1/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
    
    await checkPromise;
    expect(service.user()).toEqual(mockUser);
  });

  it('should handle refresh token success', () => {
    return new Promise<void>((resolve) => {
      localStorage.setItem('refreshToken', 'old_rtoken');
      
      service.handleRefreshToken().subscribe(token => {
        expect(token).toBe('new_atoken');
        expect(localStorage.getItem('token')).toBe('new_atoken');
        expect(localStorage.getItem('refreshToken')).toBe('new_rtoken');
        resolve();
      });
      
      const req = httpMock.expectOne('/v1/auth/refresh');
      expect(req.request.body).toEqual({ refreshToken: 'old_rtoken' });
      req.flush({
        token: 'new_atoken',
        refreshToken: 'new_rtoken',
        user: mockUser
      });
    });
  });

  it('should logout on refresh token failure', () => {
    return new Promise<void>((resolve) => {
      localStorage.setItem('refreshToken', 'bad_rtoken');
      const logoutSpy = vi.spyOn(service, 'logout');
      
      service.handleRefreshToken().subscribe({
        error: () => {
          expect(logoutSpy).toHaveBeenCalled();
          resolve();
        }
      });
      
      const req = httpMock.expectOne('/v1/auth/refresh');
      req.error(new ProgressEvent('error'), { status: 401 });
    });
  });
});
