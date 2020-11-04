import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserPoolDetailLoad } from '../actions/user-pool-detail-load';
import { UserPoolDetailStateService } from '../services/user-pool-detail-state.service';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserPoolDetailLoadGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    await this.store.dispatch(new UserPoolDetailLoad(route.params.userPoolId));
    await this.store
      .select(UserPoolDetailStateService.loading)
      .pipe(takeWhile((loading) => loading))
      .toPromise();
    if (this.store.selectSnapshot(UserPoolDetailStateService.item)) {
      return true;
    } else {
      return this.router.createUrlTree(['/app/userPools']);
    }
  }
}
