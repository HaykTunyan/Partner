// Module files.

// import Angular Module.

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { PartnersService } from './services/partners/partners.service';
import { PartnerMenuService } from './services/partner-menu/partner-menu.service';
import { UserManagementService } from './services/user-management/user-management.service';
import { AuthGuard } from './auth/auth.guard';
import {RolesGuard} from './auth/roles.guard';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { DragulaModule} from 'ng2-dragula';

// MD Bootstrap Module
import {
  MDBBootstrapModule,
  WavesModule,
  NavbarModule,
  ButtonsModule,
  ModalModule,
  TooltipModule,
  PopoverModule,
  BadgeModule,
  IconsModule,
  CardsFreeModule,
} from 'angular-bootstrap-md';

// import Component
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard-components/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderAdminComponent } from './dashboard-components/header-admin/header-admin.component';
import { DeliveryFeeComponent } from './partner-management/delivery-fee/delivery-fee.component';
import { CommissionRateComponent } from './partner-management/commission-rate/commission-rate.component';
import { PartnerMenuComponent } from './partner-management/partner-menu/partner-menu.component';
import { WorkingTimeComponent } from './partner-management/working-time/working-time.component';
import { LogHystoryComponent } from './partner-management/log-hystory/log-hystory.component';
import { PartnerListComponent } from './partner-management/partner-list/partner-list.component';
import { AddPartnerComponent } from './partner-management/add-partner/add-partner.component';

// import Material Module
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatTableModule,
  MatSelectModule,
  MatIconModule,
  MatSortModule,
  MatTooltipModule,
  MatSidenavModule,
  MatExpansionModule,
  MatListModule,
  MatMenuModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatRadioModule,
  MatChipsModule,
  MatDividerModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatBadgeModule,
  MAT_DATE_FORMATS,
  NativeDateModule

} from '@angular/material';

import { FilterPipe } from './filter.pipe';
import { SidenavComponent } from './common-components/sidenav/sidenav.component';
import { EditPartnerComponent } from './partner-management/edit-partner/edit-partner.component';
import { PartnerDetailsComponent } from './partner-management/partner-details/partner-details.component';
import { LegalEntitiesComponent } from './partner-management/legal-entities/legal-entities.component';
import { SectionListComponent } from './partner-management/section-list/section-list.component';
import { MenuComponent } from './partner-management/menu/menu.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { DataTableComponent } from './common-components/data-table/data-table.component';
import { CreateProductService } from './services/create-product/create-product.service';
import { CalendarComponent } from './common-components/calendar/calendar.component';
import { ChangePasswordComponent } from './common-components/change-password/change-password.component';
import { DeliverySettingsComponent, MY_FORMATS } from './settings/delivery-settings/delivery-settings.component';
import { OrderTypeComponent } from './settings/order-type/order-type.component';
import { BackupComponent } from './settings/backup/backup.component';
import { FlowSettingsComponent } from './settings/flow-settings/flow-settings.component';
import { CountryComponent } from './settings/country/country.component';
import { ZoneConstructorComponent } from './zone-construct/zone-constructor.component';
import { BackupTableComponent } from './settings/backup/backup-table/backup-table.component';
import { FlowTableComponent } from './settings/flow-settings/flow-table/flow-table.component';
import { StreetMapComponent } from './partner-management/street-map/street-map.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ScrollEventModule } from 'ngx-scroll-event';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MenuItemsComponent } from './partner-management/menu-items/menu-items.component';
import { OptionListComponent } from './partner-management/option-list/option-list.component';
import { MenuShedulingComponent } from './partner-management/menu-sheduling/menu-sheduling.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ForgotPasswordComponent } from './common-components/forgot-password/forgot-password.component';
import { GiftsInventoryComponent } from './partner-management/campaign-management/gifts-inventory/gifts-inventory.component';
import { CampaignComponent } from './partner-management/campaign-management/campaign/campaign.component';
import { NewCampaignComponent } from './partner-management/campaign-management/new-campaign/new-campaign.component';
import { DiscountOrDeliveryFeeCampaignComponent } from './partner-management/campaign-management/new-campaign/discount-or-delivery-fee-campaign/discount-or-delivery-fee-campaign.component';
import { ComboSetCampaignComponent } from './partner-management/campaign-management/new-campaign/combo-set-campaign/combo-set-campaign.component';
import { BonusComponent } from './partner-management/campaign-management/new-campaign/bonus/bonus.component';
import { FreeItemComponent } from './partner-management/campaign-management/new-campaign/free-item/free-item.component';
import { SponsoredPartnerItemsComponent } from './partner-management/campaign-management/new-campaign/sponsored-partner-items/sponsored-partner-items.component';
import { VoucherComponent } from './partner-management/campaign-management/new-campaign/voucher/voucher.component';
import { OutOfScheduleItemsComponent } from './partner-management/campaign-management/new-campaign/out-of-schedule-items/out-of-schedule-items.component';
import { PromoCodeComponent } from './partner-management/campaign-management/new-campaign/promo-code/promo-code.component';
import { CustomersListSelectionComponent } from './partner-management/campaign-management/new-campaign/customers-list-selection/customers-list-selection.component';
import { ReminderCalendarComponent } from './common-components/reminder-calendar/reminder-calendar.component';
import { DailyLimitComponent } from './partner-management/working-time/daily-limit/daily-limit.component';
import { DeactivatePeriodComponent } from './partner-management/working-time/deactivate-period/deactivate-period.component';
import { FixedPeriodComponent } from './partner-management/menu-sheduling/fixed-period/fixed-period.component';
import { LimitComponent } from './partner-management/menu-sheduling/limit/limit.component';
import { MenuLogHistoryComponent } from './partner-management/menu-log-history/menu-log-history.component';
import { UpdateMenuItemComponent } from './partner-management/update-menu-item/update-menu-item.component';
import { AttacheOptionComponent } from './partner-management/attache-option/attache-option.component';
import { EditMenusComponent } from './partner-management/edit-menus/edit-menus.component';





// NgModule
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderAdminComponent,
    DeliveryFeeComponent,
    CommissionRateComponent,
    PartnerMenuComponent,
    WorkingTimeComponent,
    LogHystoryComponent,
    PartnerListComponent,
    FilterPipe,
    SidenavComponent,
    EditPartnerComponent,
    PartnerDetailsComponent,
    LegalEntitiesComponent,
    SectionListComponent,
    AddPartnerComponent,
    MenuComponent,
    UserManagementComponent,
    DataTableComponent,
    ChangePasswordComponent,
    CalendarComponent,
    ChangePasswordComponent,
    CountryComponent,
    OrderTypeComponent,
    BackupComponent,
    FlowSettingsComponent,
    DeliverySettingsComponent,
    ZoneConstructorComponent,
    DeliverySettingsComponent,
    BackupTableComponent,
    FlowTableComponent,
    DeliverySettingsComponent,
    StreetMapComponent,
    MenuItemsComponent,
    OptionListComponent,
    MenuShedulingComponent,
    ForgotPasswordComponent,
    MenuShedulingComponent,
    GiftsInventoryComponent,
    CampaignComponent,
    NewCampaignComponent,
    DiscountOrDeliveryFeeCampaignComponent,
    ComboSetCampaignComponent,
    BonusComponent,
    FreeItemComponent,
    SponsoredPartnerItemsComponent,
    VoucherComponent,
    OutOfScheduleItemsComponent,
    PromoCodeComponent,
    CustomersListSelectionComponent,
    ReminderCalendarComponent,
    DailyLimitComponent,
    DeactivatePeriodComponent,
    FixedPeriodComponent,
    LimitComponent,
    MenuLogHistoryComponent,
    UpdateMenuItemComponent,
    AttacheOptionComponent,
    EditMenusComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    AppRoutingModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    MatSortModule,
    MatTooltipModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatChipsModule,
    MatDividerModule,
    MatAutocompleteModule,
    MDBBootstrapModule.forRoot(),
    WavesModule.forRoot(),
    NavbarModule,
    ModalModule,
    TooltipModule,
    PopoverModule,
    ButtonsModule.forRoot(),
    BadgeModule,
    IconsModule,
    MatBadgeModule,
    CardsFreeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    NativeDateModule,
    InfiniteScrollModule,
    ScrollEventModule,
    NgxLoadingModule.forRoot({}),
    FilterPipeModule,
    DragulaModule.forRoot(),
  ],
  providers: [
    AuthService,
    PartnersService,
    PartnerMenuService,
    CreateProductService,
    AuthGuard,
    RolesGuard,
    UserManagementService,
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  bootstrap: [
    AppComponent
  ]
})

// export AppModule
export class AppModule {
}
// platformBrowserDynamic().bootstrapModule(AppModule);
