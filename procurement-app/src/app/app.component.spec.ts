import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserProfile', 'logout']);
    mockAuthService.getUserProfile.and.returnValue(Promise.resolve({
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    }));

    mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe', 'isMatched']);
    mockBreakpointObserver.observe.and.returnValue(of({ matches: false, breakpoints: {} }));
    mockBreakpointObserver.isMatched.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        provideRouter([]),
        provideAnimations()
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the Procurement System title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Procurement System');
  });

  it('should load user profile on init', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    await app.ngOnInit();
    
    expect(mockAuthService.getUserProfile).toHaveBeenCalled();
    expect(app.username).toBe('testuser');
    expect(app.userEmail).toBe('test@example.com');
  });

  it('should call logout on AuthService when logout is called', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    await app.logout();
    
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
