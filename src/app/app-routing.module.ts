// Routing Module

// Import Module
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard-components/dashboard/dashboard.component';
import { DeliveryFeeComponent } from './partner-management/delivery-fee/delivery-fee.component';
import { CommissionRateComponent } from './partner-management/commission-rate/commission-rate.component';
import { PartnerMenuComponent } from './partner-management/partner-menu/partner-menu.component';
import { WorkingTimeComponent } from './partner-management/working-time/working-time.component';
import { LogHystoryComponent } from './partner-management/log-hystory/log-hystory.component';
import { PartnerListComponent } from './partner-management/partner-list/partner-list.component';
import { EditPartnerComponent } from './partner-management/edit-partner/edit-partner.component';
import { PartnerDetailsComponent } from './partner-management/partner-details/partner-details.component';
import { AddPartnerComponent } from './partner-management/add-partner/add-partner.component';
import { MenuComponent } from './partner-management/menu/menu.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ChangePasswordComponent } from './common-components/change-password/change-password.component';
import { CountryComponent } from './settings/country/country.component';
import { OrderTypeComponent } from './settings/order-type/order-type.component';
import { DeliverySettingsComponent } from './settings/delivery-settings/delivery-settings.component';
import { BackupComponent } from './settings/backup/backup.component';
import { FlowSettingsComponent } from './settings/flow-settings/flow-settings.component';
import { ZoneConstructorComponent } from './zone-construct/zone-constructor.component';
import {GiftsInventoryComponent} from './partner-management/campaign-management/gifts-inventory/gifts-inventory.component';
import {CampaignComponent} from './partner-management/campaign-management/campaign/campaign.component';
import {NewCampaignComponent} from './partner-management/campaign-management/new-campaign/new-campaign.component';
import {RolesGuard} from './auth/roles.guard';
import {LegalEntitiesComponent} from './partner-management/legal-entities/legal-entities.component';
import {SectionListComponent} from './partner-management/section-list/section-list.component';
import { MenuItemsComponent } from './partner-management/menu-items/menu-items.component';
import { OptionListComponent } from './partner-management/option-list/option-list.component';
import { MenuShedulingComponent } from './partner-management/menu-sheduling/menu-sheduling.component';
import {EditMenusComponent} from './partner-management/edit-menus/edit-menus.component';
import {MenuLogHistoryComponent} from './partner-management/menu-log-history/menu-log-history.component';
import { ForgotPasswordComponent } from './common-components/forgot-password/forgot-password.component';


// Routes
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch : 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'activate', component: ChangePasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'reset-password', component: ChangePasswordComponent },
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'partner-list', component: PartnerListComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'}},
  { path: 'delivery-fee', component: DeliveryFeeComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'} },
  { path: 'commission-rate', component: CommissionRateComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'}},
  { path: 'partner-menu', component: PartnerMenuComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'} },
  { path: 'working-time', component: WorkingTimeComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'} },
  { path: 'log-history', component: LogHystoryComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'} },
  { path: 'edit-partner', component: EditPartnerComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'} },
  { path: 'partner-details', component: PartnerDetailsComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'} },
  { path: 'legal-entities', component: LegalEntitiesComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'} },
  { path: 'section-list', component: SectionListComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'} },
  { path: 'campaign-management/campaign', component: CampaignComponent, canActivate: [RolesGuard],  data: {role: 'Campaign Management'} },
  { path: 'campaign-management/giftsInventory', component: GiftsInventoryComponent, canActivate: [RolesGuard],  data: {role: 'Campaign Management'} },
  { path: 'campaign-management/new-campaign', component: NewCampaignComponent, canActivate: [RolesGuard],  data: {role: 'Campaign Management'} },
  { path: 'campaign-management/update-campaign/:id', component: NewCampaignComponent, canActivate: [RolesGuard],  data: {role: 'Campaign Management'} },
  { path: 'add-partner', component: AddPartnerComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'} },
  { path: 'menu', component: MenuComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'} },
  { path: 'edit-partner', component: EditPartnerComponent, canActivate: [RolesGuard],  data: {role: 'Partner Management'} },
  { path: 'user-management', component: UserManagementComponent, canActivate: [RolesGuard],  data: {role: 'User Management'}},
  { path: 'settings/country', component: CountryComponent, canActivate: [RolesGuard],  data: {role: 'Settings'}},
  { path: 'settings/order-type', component: OrderTypeComponent, canActivate: [RolesGuard],  data: {role: 'Settings'} },
  { path: 'settings/delivery', component: DeliverySettingsComponent, canActivate: [RolesGuard],  data: {role: 'Settings'} },
  { path: 'settings/flow-settings', component: FlowSettingsComponent, canActivate: [RolesGuard],  data: {role: 'Flow Management'}},
  { path: 'settings/backup', component: BackupComponent, canActivate: [RolesGuard],  data: {role: 'Settings'} },
  { path: 'zone', component: ZoneConstructorComponent, canActivate: [RolesGuard],  data: {role: 'Zone Constructor'} },
  { path: 'menu-items', component: MenuItemsComponent },
  { path: 'option-list', component: OptionListComponent },
  { path: 'option-list/:id', component: OptionListComponent},
  { path: 'menu-sheduling', component: MenuShedulingComponent },
  { path: 'update-menu/:id', component: EditMenusComponent},
  { path: 'menu-log-history', component: MenuLogHistoryComponent},
  { path: '**', redirectTo: 'dashboard' }
]

// NgModule
@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        useHash: false ,
        enableTracing: false
      },
      )
  ],
  exports: [
    RouterModule,
  ],
  declarations: []
})

// export App Routing Module
export class AppRoutingModule { }
