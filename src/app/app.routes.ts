import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from './features/favorites/favorites';
import { HomeComponent } from './features/home/home';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {
        path: 'favorites',
        loadComponent: () => import('./features/favorites/favorites').then(mod => mod.FavoritesComponent)
    },
    {
        path: 'modal',
        loadComponent: () => import('./core/components/character-detail/character-detail').then(mod => mod.CharacterDetailModalComponent)

    },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
