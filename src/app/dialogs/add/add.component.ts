import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../../models/user';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent {
  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    public dataService: DataService
  ) {}

  formControl = new FormControl('', [Validators.required]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }
  submit() {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {}
  public confirmAdd(): void {
    console.log('confirmAdd');
    this.dataService.addUser(this.data);
  }
}
