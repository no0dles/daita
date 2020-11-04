import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { takeWhile } from 'rxjs/operators';
import { UserDetailLoad } from '../actions/user-detail-load';
import { UserDetailStateService } from '../services/user-detail-state.service';

@Injectable({
  providedIn: 'root',
})
export class UserDetailLoadGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    await this.store.dispatch(new UserDetailLoad(route.params.userPoolId, route.params.username));
    await this.store
      .select(UserDetailStateService.loading)
      .pipe(takeWhile((loading) => loading))
      .toPromise();
    if (this.store.selectSnapshot(UserDetailStateService.item)) {
      return true;
    } else {
      return this.router.createUrlTree(['/app/users']);
    }
  }
}
