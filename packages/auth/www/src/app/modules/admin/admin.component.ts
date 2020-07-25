import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  navItems = [
    {name: 'User Pools', links: ['/app/userPools']},
    {name: 'Users', links: ['/app/users']},
    {name: 'Roles', links: ['/app/roles']},
  ]
}
