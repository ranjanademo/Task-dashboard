import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { User } from '../user';
import { UserService } from '../user.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,MatButtonModule,MatTableModule,MatSortModule,MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {

  users:User[]=[];
  filteredUsers:User[]=[];
  readonly dialog = inject(MatDialog);
  user:User={
    id:0,
    title:'',
    description:'',
    priority: "High",
    dueDate: new Date(),
    status: 'Pending',
  }

  displayedColumns: string[] = ['id', 'title', 'description', 'priority','status','dueDate','edit','delete'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatSort) sort: any;

  constructor(private userService:UserService){}

  ngAfterViewInit(): void {
    this.userService.fetchAllUsers().subscribe((data)=>{
      this.users=data;

      this.dataSource = new MatTableDataSource<User>(data);
      this.dataSource.sort = this.sort;
    })
  }

  searchUser(input:String){
    this.filteredUsers=this.users.filter(item=>item.status.toLowerCase().includes(input.toLocaleLowerCase())
  || item.priority.toLowerCase().includes(input.toLowerCase())
  || item.title.toLowerCase().includes(input.toLowerCase())
  || item.description.toLowerCase().includes(input.toLowerCase()));
  this.dataSource = new MatTableDataSource<User>(this.filteredUsers);
  }

  openDialog(userFrm:User):void{
    const dialogRef = this.dialog.open(UserFormComponent,{
      data:userFrm,
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.user.id = Number(result.id);
        this.user.title = result.title;
        this.user.description = result.description;
        this.user.priority = result.priority;
        this.user.dueDate = result.dueDate;
        this.user.status = result.status;
         // Add the new user to the list
      this.users.push(this.user);
      this.dataSource = new MatTableDataSource<User>(this.users);
      }
    });
  }

  deleteUser(id:number){
    const isConfirmed=window.confirm('Are you sure you want to delete your record');
    if(isConfirmed){
      this.userService.deleteUsers(id).subscribe(()=>{
        this.users=this.users.filter(item=>item.id!==id);
      })
      window.location.reload();
    }
  }
}
