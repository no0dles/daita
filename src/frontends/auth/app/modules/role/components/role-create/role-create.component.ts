import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { Role } from '../../../../../../../packages/auth/models/role';
import { table } from '../../../../../../../packages/relational/sql/function/table';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss'],
})
export class RoleCreateComponent implements OnInit {
  form!: FormGroup;

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl(),
    });
  }

  async save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const data = this.form.getRawValue();
    await this.api.insert({
      into: table(Role),
      insert: {
        name: data.name,
        description: data.description,
      },
    });
    await this.router.navigate(['..'], { relativeTo: this.route });
  }
}
