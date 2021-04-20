import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
  constructor(
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: DataService
  ) {}

  formControl = new FormControl('', [Validators.required]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }
  submit() {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.dataService.updateUser(this.data);
  }
}
