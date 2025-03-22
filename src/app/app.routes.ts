import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SignPageComponent } from './pages/sign-page/sign-page.component';

export const routes: Routes = [
	{ path: '', component: HomePageComponent, title: 'Life calendar' },
	{ path: 'sign', component: SignPageComponent, title: 'Sign' },
	{ path: 'profile', component: ProfilePageComponent, title: 'Profile' },
	// Error pages
	{ path: '**', component: NotFoundPageComponent, title: '404 Page non trouvée' },
];
