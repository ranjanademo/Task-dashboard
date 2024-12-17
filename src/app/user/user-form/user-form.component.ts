import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [MatDialogModule,MatDialogTitle,MatDialogActions,MatDialogContent,MatIconModule,
            MatFormFieldModule,MatInputModule,MatButtonModule,FormsModule,CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {

  readonly dialogRef=inject(MatDialogRef<UserFormComponent>);
  data=inject<User>(MAT_DIALOG_DATA)

  constructor(private userService:UserService){

  }

  addOrEditUser(user:User){
     if(user.id==0){
      this.userService.createUsers(user).subscribe({
        next:(data)=>{
          console.log("user created sucessfully");
          window.location.reload();
        },
        error:(err)=>{
          console.log(err);
        }
      })
     }else{
      this.userService.updateUsers(user).subscribe({
        next:(data)=>{
          console.log("user updated sucessfully");
          window.location.reload();
        },
        error:(err)=>{
          console.log(err);
        }
      })
     }
  }

}
