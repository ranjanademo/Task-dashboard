import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import { User } from '../user';
import { UserService } from '../user.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  const mockUsers: User[] = [
    { id: 1, title: 'Task 1', description: 'Description 1', priority: 'High', dueDate: new Date('2024-12-20'), status: 'Pending' },
    { id: 2, title: 'Task 2', description: 'Description 2', priority: 'Medium', dueDate: new Date('2024-12-25'), status: 'Completed' },
  ];

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['fetchAllUsers', 'deleteUsers']);
    const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    userServiceSpy.fetchAllUsers.and.returnValue(of(mockUsers));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all users and initialize dataSource', () => {
    component.ngAfterViewInit();
    expect(userServiceSpy.fetchAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.dataSource.data).toEqual(mockUsers);
  });

  it('should filter users based on the search input', () => {
    component.users = mockUsers;
    component.searchUser('Task 1');
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].title).toBe('Task 1');
  });

  it('should open the dialog with the correct user data', () => {
    const mockDialogRef = {
      afterClosed: () => of(mockUsers[0]),
    };

    matDialogSpy.open.and.returnValue(mockDialogRef as any);

    component.openDialog(mockUsers[0]);
    expect(matDialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: mockUsers[0],
    });
  });

  it('should handle dialog close and update the user object including dueDate', () => {
    const mockDialogRef = {
      afterClosed: () => of(mockUsers[0]),
    };

    matDialogSpy.open.and.returnValue(mockDialogRef as any);

    component.openDialog(mockUsers[0]);
    expect(component.user).toEqual(mockUsers[0]);
    expect(component.user.dueDate).toEqual(new Date('2024-12-20'));
  });

  it('should delete a user when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    userServiceSpy.deleteUsers.and.returnValue(of({}));

    component.users = [...mockUsers];
    component.deleteUser(1);

    expect(userServiceSpy.deleteUsers).toHaveBeenCalledWith(1);
    expect(component.users.length).toBe(1);
    expect(component.users[0].id).toBe(2);
  });

  it('should not delete a user if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.users = [...mockUsers];
    component.deleteUser(1);

    expect(userServiceSpy.deleteUsers).not.toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });
});
