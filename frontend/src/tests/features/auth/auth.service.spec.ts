import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../app/features/auth/auth.service';
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

  it('should hydrate user from localStorage on init', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'some-token');
    
    // Re-inject to trigger constructor
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock }
      ]
    });
    const newService = TestBed.inject(AuthService);
    expect(newService.user()).toEqual(mockUser);
  });

  it('should logout on hydrate if localStorage is corrupted', () => {
    localStorage.setItem('user', 'invalid-json');
    localStorage.setItem('token', 'some-token');
    
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock }
      ]
    });
    
    const newService = TestBed.inject(AuthService);
    expect(newService.user()).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
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

  it('should logout if no token in checkAuth', async () => {
    const logoutSpy = vi.spyOn(service, 'logout');
    await service.checkAuth();
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should logout if checkAuth fails and no user is set', async () => {
    localStorage.setItem('token', 'atoken');
    const logoutSpy = vi.spyOn(service, 'logout');
    
    const checkPromise = service.checkAuth();
    const req = httpMock.expectOne('/v1/auth/me');
    req.error(new ProgressEvent('error'), { status: 401 });
    
    await checkPromise;
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should NOT logout if checkAuth fails but user is already set', async () => {
    service.login('atoken', 'rtoken', mockUser);
    const logoutSpy = vi.spyOn(service, 'logout');
    
    const checkPromise = service.checkAuth();
    const req = httpMock.expectOne('/v1/auth/me');
    req.error(new ProgressEvent('error'), { status: 500 });
    
    await checkPromise;
    expect(logoutSpy).not.toHaveBeenCalled();
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

  it('should handle concurrent refresh token calls', () => {
    localStorage.setItem('refreshToken', 'old_rtoken');
    
    let calls = 0;
    service.handleRefreshToken().subscribe(token => {
      expect(token).toBe('new_atoken');
      calls++;
    });
    
    service.handleRefreshToken().subscribe(token => {
      expect(token).toBe('new_atoken');
      calls++;
    });
    
    const req = httpMock.expectOne('/v1/auth/refresh');
    req.flush({
      token: 'new_atoken',
      refreshToken: 'new_rtoken',
      user: mockUser
    });
    
    expect(calls).toBe(2);
  });

  it('should throw error if no refresh token available', () => {
    const logoutSpy = vi.spyOn(service, 'logout');
    service.handleRefreshToken().subscribe({
      error: (err) => {
        expect(err.message).toBe('No refresh token available');
        expect(logoutSpy).toHaveBeenCalled();
      }
    });
  });
});
