import {Component, OnInit} from '@angular/core';
import {ZoneConstructorService} from '../services/zone/zone-constructor.service';
import {Router} from '@angular/router';

declare let L;

@Component({
  selector: 'app-zone',
  templateUrl: './zone-constructor.component.html',
  styleUrls: ['./zone-constructor.component.scss']
})
export class ZoneConstructorComponent implements OnInit {
  value; // value in Input modal div
  bgStatus = true; // status of  Create Area button
  modalDivStatus = false; // status of open and close modal div
  modalDivConfirmStatus = false; // status of open and close modal div for confirm
  removeLastLayerStatus = false; // status of remove last layer in map
  modalStatus = true; // status of open and close modal div
  modalType: String; // type of modal window of zone or area
  modalTypeConfirm: String; // type of modal confirm window of zone or area
  lat: number; // Latitude points zone
  lng: number; // longitude points zone
  areasZone = []; // array of zones or Areas
  divClickStatus = false;
  checkbox = false;
  zones: any = []; // array of zones
  areas: any; // array of areas
  points: any = []; // array of latitude longitude points
  areaButtonDisabled = true;
  isCheckedArr = [];
  setLatLng = [];
  updateZone = false;
  updateArea = false;
  zoneID;
  areaID;
  zoneNames;
  areaNames;
  zonesArea;
  latlngs = [];
  polygonDrawer;
  map;
  clickLat; //  latitude of points when  clicking
  clickLng; // longitude of points when clicking
  polygonId: number; // id of drawing polygon
  saveTempZone = []; // temporary array of zones
  isCreateArea = false;
  errorShow = false;
  typeError; // type error zone or group
  errorStatus = 409; // status error
  IDToRemove;
  removeZoneFromArea = false;
  removeZoneOrArea = false;
  tileLayer;  // variable for background of map
  clickAreaStatus = false;
  mouseIn = false; // variable to check if mouse is on area name or not
  bgAreasStatus = false;
  arrayForPaintedLayer: any = [];
  IsEdit = false;
  areaNameDivBG; // background of area name div
  inputValCheck ;

  constructor(private zoneConstructorService: ZoneConstructorService, private router: Router) {
  }


  ngOnInit() {
    this.IsEdit = this.decideUserStatus();
    this.createMap();
    this.getAllZone();
    this.getAllAreas();
    this.clickOnMap();
  }

  // log out function.
  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('menu-user');
  }
  // check user authentication and role status. Zone Constructor
  decideUserStatus(): boolean {
    const menuUser = JSON.parse(localStorage.getItem('menu-user'));
    if (menuUser) {
      if (menuUser.token && menuUser.userDto) {
        if (Array.isArray(menuUser.userDto.roleDtos)) {
          for (let i = 0; i < menuUser.userDto.roleDtos.length; i++) {
            if (menuUser.userDto.roleDtos[i].name === 'Zone Constructor') {
              if (menuUser.userDto.roleDtos[i].action === 'EDIT') {
                i = Infinity;
                return true;
              } else if (menuUser.userDto.roleDtos[i].action === 'VIEW') {
                i = Infinity;
                return false;
              }
            }
          } this.logout();
        } else {
          this.logout();
        }
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  /**
   * function for map creation
   */
  createMap() {

    this.map = L.map('map').setView([40.179188, 44.499104], 13);
    this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.tileLayer.redraw();

  }


  /**
   * function to delete clicked area name background color clicking on map
   */
  clickOnMap(this) {
    const map = this.map;
    let bgAreasStatus = this.clickAreaStatus;
    map.on('click', (function (e) {
      if (this.clickAreaStatus) {
        for (let i in map._layers) {
          const mapLayerCordinats = map._layers[i]._latlngs;
          if (mapLayerCordinats !== undefined) {
            map._layers[i].setStyle({color: '#47e797', weight: 2, fillColor: '#969ba3', fillOpacity: 0});
          }
        }
      }
      this.clickAreaStatus = false;
      this.areaNameDivBG = false;
    }).bind(this));
  }


  /**
   * function for starting to draw on map
   */
  drawOnMap() {
    const map = this.map;
    this.polygonDrawer = new L.Draw.Polygon(this.map);
    this.polygonDrawer.enable();
    map.on(L.Draw.Event.CREATED, (function (e) {
      this.setLatLng = e.layer._latlngs[0];
      this.points = [];
      for (let i = 0; i < this.setLatLng.length; i++) {
        this.points.push({'latitude': this.setLatLng[i].lat, 'longitude': this.setLatLng[i].lng});
      }
      const type = e.layerType,
        layer = e.layer;
      if (type === 'polygon') {
        this.activateAreaButton('Zone');
      }
      map.addLayer(layer);
      layer.setStyle({color: '#47e797', weight: 2, fillColor: '#969ba3'});
    }).bind(this));
  }

  /**
   * function for delete last point of polygon when pressing backspace
   */
  deleteLastPoint() {
    this.polygonDrawer.deleteLastVertex();
  }

  /***
   * function for rendering zones on the map
   */
  renderZoneOnMap() {
    // this.refreshLayer();
    for (let i = 0; i < this.latlngs.length; i++) {
      const polygon = L.polygon(this.latlngs[i], {color: '#47e797', weight: 2, fillColor: '#969ba3', fillOpacity: 0}).addTo(this.map);
      polygon.on('click', function (event) {
        this.clickLat = event.sourceTarget._latlngs[0][0].lat;
        this.clickLng = event.sourceTarget._latlngs[0][0].lng;
        this.selectZoneOnMap();
      }, this);
    }
  }


  /**
   * function for  zone selection when we click on the map
   */
  selectZoneOnMap() {

    if (!this.clickAreaStatus) {
      let tempZone = {};
      let tempLayer;
      for (let i = 0; i < this.zones.length; i++) {
        for (let j = 0; j < this.zones[i].points.length; j++) {
          if (this.zones[i].points[j].latitude === this.clickLat && this.zones[i].points[j].longitude === this.clickLng) {
            this.polygonId = this.zones[i].id;
            tempLayer = this.zones[i];
            tempZone = {
              lat: this.zones[i].points[j].latitude,
              lng: this.zones[i].points[j].longitude
            };
            this.saveTempZone.push(tempZone);

          }
        }
      }

      for (let i in this.map._layers) {
        const mapLayerCordinats = this.map._layers[i]._latlngs;
        if (mapLayerCordinats !== undefined) {
          if (mapLayerCordinats[0][0].lat === tempZone['lat'] && mapLayerCordinats[0][0].lng === tempZone['lng'] && this.map._layers[i].options.fillOpacity === 0) {
            tempLayer['selected'] = true;
            this.isCheckedArr.push(true);
            this.verifyIsCheckedArr();
            this.map._layers[i].setStyle({color: '#47e797', weight: 2, fillColor: '#969ba3', fillOpacity: 0.5});
          } else if (mapLayerCordinats[0][0].lat === tempZone['lat'] && mapLayerCordinats[0][0].lng === tempZone['lng'] && this.map._layers[i].options.fillOpacity === 0.5) {
            tempLayer['selected'] = false;
            this.isCheckedArr.pop();
            this.verifyIsCheckedArr();
            this.map._layers[i].setStyle({color: '#47e797', weight: 2, fillColor: '#969ba3', fillOpacity: 0});
          }
        }
      }
    }

  }


  /**
   * function for removal of background of selected zone
   */
  removeBGZone() {
    for (let i in this.map._layers) {
      const mapLayerCordinats = this.map._layers[i]._latlngs;
      if (mapLayerCordinats !== undefined) {
        for (let j = 0; j < this.saveTempZone.length; j++) {
          if (mapLayerCordinats[0][0].lat === this.saveTempZone[j]['lat'] && mapLayerCordinats[0][0].lng === this.saveTempZone[j]['lng'] && this.map._layers[i].options.fillOpacity === 0.5) {
            this.map._layers[i].setStyle({color: '#47e797', weight: 2, fillColor: '#969ba3', fillOpacity: 0});
          }
        }
      }
    }
  }


  /**
   * function to get all zones from DB
   */
  getAllZone() {
    this.latlngs = [];
    this.zoneConstructorService.getAllZone().subscribe(response => {
      const tempLatLng = [];
      this.zones = response;
      for (let i = 0; i < this.zones.length; i++) {
        this.zones[i].selected = false;
        tempLatLng.push(this.zones[i]['points']);
      }
      for (let i = 0; i < tempLatLng.length; i++) {
        const arr = [];
        const temporaryLatLang = JSON.parse(JSON.stringify(tempLatLng[i]));
        for (let j = 0; j < temporaryLatLang.length; j++) {
          arr.push([temporaryLatLang[j].latitude, temporaryLatLang[j].longitude]);
        }
        this.latlngs.push(JSON.parse(JSON.stringify(arr)));
      }
      this.renderZoneOnMap();
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }

  /**
   * function to get all areas from DB
   */
  getAllAreas() {
    this.zoneConstructorService.getAllAreas().subscribe(response => {
      this.areas = response;
      for (let i = 0; i < this.areas.length; i++) {

        if (this.areas[i].zone.length === 0) {
          this.deleteArea(this.areas[i].id);
        }
      }
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }

  /**
   * function for removing last added layer on map when we click outside the pop-up
   */
  removeLastLayer() {
    const map = this.map;
    let id;
    for (let i in map._layers) {
      id = i;
    }
    map.removeLayer(map._layers[id]);

  }

  /**
   * function for refresh and rendering  all layers on map
   */
  refreshLayer() {
    for (let i in this.map._layers) {
      if (this.map._layers[i] !== this.tileLayer) {
        this.map.removeLayer(this.map._layers[i]);
      }
    }

  }


  /**
   * function to open modal window
   */
  openDialog() {
    // this.value = '';
    if (this.modalStatus === false) {
      this.modalDivStatus = true;
    } else {
      this.modalDivStatus = false;
      this.errorShow = false;
      this.value = '';
    }
    if (this.removeLastLayerStatus === false && this.isCreateArea === false) {
      this.removeLastLayer();
      this.removeLastLayerStatus = false;
    }
  }

  /**
   * function to open modal window for  confirm remove
   */
  openDialogConfirm(id, type) {
    if (this.modalDivConfirmStatus === false) {
      this.modalDivConfirmStatus = true;
      this.IDToRemove = id;
      this.modalTypeConfirm = type;
      if (this.modalTypeConfirm === 'Zone' || this.modalTypeConfirm === 'Area') {
        this.removeZoneFromArea = false;
        this.removeZoneOrArea = true;
      } else {
        this.removeZoneOrArea = false;
        this.removeZoneFromArea = true;
      }

    }

  }

  /**
   * function to change status to false of modal window
   */
  popupStatusChangeFalse() {
    this.modalStatus = false;
    this.removeLastLayerStatus = true;
  }

  /**
   * function to change status to true of modal window
   */
  popupStatusChangeTrue() {
    this.modalStatus = true;
    this.removeLastLayerStatus = false;
  }

  /**
   * function for delete zone
   * @param id -> id of the deleting zone
   */
  deleteZone(id) {
    this.latlngs = [];
    this.zoneConstructorService.deleteZone(id).subscribe(response => {
      this.getAllZone();
      this.getAllAreas();

    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
    this.areaButtonDisabled = true;
    this.bgStatus = true;
    this.isCheckedArr = [];
    this.refreshLayer();

  }

  /**
   * function for delete area
   * @param id -> id of the deleting area
   */
  deleteArea(id) {
    this.zoneConstructorService.deleteArea(id).subscribe(response => {
      this.getAllAreas();
    });
  }

  /**
   * function for delete zone from area
   * @param id -> id of deleting zone
   */
  deleteZoneFromArea(id) {
    this.zoneConstructorService.deleteZoneFromArea(id).subscribe(response => {
      this.getAllAreas();
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
    // this.refreshLayer()
  }

  /**
   * function for adding and updating area and zone name
   * @param value -> name of area or zine
   */
  addAndUpdateZoneAndArea(value) {
    this.value = '';
    if (this.modalType === 'Area') {
      if (this.updateArea === true) {
        this.areaNames = value;
        this.updateAreaServer();
        this.updateArea = false;
      } else {

        this.areasZoneAdd();
        const form = {
          name: value,
          zone: this.areasZone
        };
        this.zoneConstructorService.addArea(form).subscribe(response => {
          if (response === null) {
            this.getAllAreas();
            this.errorShow = false;
            this.areasZone = [];
            this.zoneSelectedDisable();
            this.removeBGZone();
            this.removeBGZoneOnCheckbox();
            this.isCheckedArr = [];
            this.areaButtonDisabled = true;
            this.bgStatus = !this.bgStatus;
            this.checkbox = false;
            this.getAllZone();
          }

        }, error => {
          if (error.status === this.errorStatus || error.status === 400) {
            this.modalDivStatus = true;
            this.removeLastLayerStatus = true;
            this.isCreateArea = true;
            this.value = value;
            this.errorShow = true;
            this.typeError = 'group';
          } else if (error.status === 401 || error.status === 403) {
            this.logout();
          }

        });
      }
    } else if (this.modalType === 'Zone') {
      if (this.updateZone === true) {
        this.zoneNames = value;
        this.updateZoneServer();
        this.updateZone = false;
      } else {
        const form = {
          name: value,
          points: this.points
        };
        this.zoneConstructorService.addZone(form).subscribe(response => {
          if (response === null) {
            this.latlngs = [];
            this.getAllZone();
            this.renderZoneOnMap();
            this.modalDivStatus = false;
            this.isCheckedArr = [];
            this.verifyIsCheckedArr();
            this.removeBGZone();
          }
        }, error => {

          if (error.status === this.errorStatus || error.status === 400) {
            this.modalDivStatus = true;
            this.removeLastLayerStatus = true;
            this.isCreateArea = true;
            this.value = value;
            this.errorShow = true;
            this.typeError = 'zone';
          } else if (error.status === 401 || error.status === 403) {
            this.logout();
          }

        });
        this.errorShow = false;
      }
    }
  }

  /**
   * function to mark and unmark zone in list
   * @param value -> true or false status checkbox
   * @param zoneServerID -> id zone get in DB
   * @param id -> id in list
   */
  onChkChange(value, zoneServerID, id) {
    if (value === true) {
      this.zones[id].selected = true;
      this.divClickStatus = true;
      this.isCheckedArr.push(value);
      this.verifyIsCheckedArr();
      this.addBGZoneOnCheckbox();
    } else {
      this.zones[id].selected = false;
      this.isCheckedArr.pop();
      this.verifyIsCheckedArr();
      this.removeBGZoneOnCheckbox();
    }
  }

  /**
   * function to add background of zone in marked checkbox
   */
  addBGZoneOnCheckbox() {
    this.addAndRemoveBGZoneOnCheckbox(true, 0.5);
  }

  /**
   * function to remove background of zone in unmarked checkbox
   */
  removeBGZoneOnCheckbox() {
    this.addAndRemoveBGZoneOnCheckbox(false, 0);
  }

  addAndRemoveBGZoneOnCheckbox(status, fillOpacity) {
    let zoneCord;
    for (let i = 0; i < this.zones.length; i++) {
      if (this.zones[i].selected === status) {
        zoneCord = this.zones[i].points[0];
        for (let i in this.map._layers) {
          const mapLayerCordinats = this.map._layers[i]._latlngs;
          if (mapLayerCordinats !== undefined) {
            if (mapLayerCordinats[0][0].lat === zoneCord['latitude'] && mapLayerCordinats[0][0].lng === zoneCord['longitude']) {
              this.map._layers[i].setStyle({color: '#47e797', weight: 2, fillColor: '#969ba3', fillOpacity: fillOpacity});
            }
          }
        }
      }
    }
  }

  /**
   * function to verify which checkboxes are marked and which are not
   */
  verifyIsCheckedArr() {
    if (this.isCheckedArr.length >= 2) {
      this.areaButtonDisabled = false;
      this.bgStatus = false;
    } else {
      this.areaButtonDisabled = true;
      this.bgStatus = true;
    }
  }

  /**
   * function to add zone in area
   */
  areasZoneAdd() {
    for (let i = 0; i < this.zones.length; i++) {
      if (this.zones[i].selected === true) {
        this.areasZone.push({
          id: this.zones[i].id,
          name: this.zones[i].name
        });
      }
    }
  }

  /**
   * function to disable selected zone
   */
  zoneSelectedDisable() {
    for (let i = 0; i < this.zones.length; i++) {
      if (this.zones[i].selected === true) {
        this.zones[i].selected = false;
      }
    }
  }

  /**
   * function to activate drawing on map
   */
  activateDrawingOnMap() {
    this.drawOnMap();
  }

  /**
   * function to edit zone name
   * @param id -> zone id
   * @param zoneName -> new zone name
   * @param area -> parent area this zone
   */
  editZone(id, zoneName, area) {
    this.zonesArea = area;
    this.updateZone = true;
    this.value = zoneName;
    this.zoneID = id;
    this.activateAreaButton('Zone');

  }

  /**
   * function to edit name of area
   * @param id -> id area
   * @param areaName -> new name area
   */
  editArea(id, areaName) {
    this.updateArea = true;
    this.value = areaName;
    this.areaID = id;
    this.activateAreaButton('Area');
  }

  /**
   * function to update zone in DB
   */
  updateZoneServer() {
    const form = {
      'area': this.zonesArea,
      id: this.zoneID,
      name: this.zoneNames
    };
    this.zoneConstructorService.updateZone(form).subscribe(response => {
      if (response === null) {
        this.getAllZone();
        this.getAllAreas();
        this.errorShow = false;
      }
    }, error => {
      if (error.status === this.errorStatus || error.status === 400) {
        this.updateZone = true;
        this.modalDivStatus = true;
        this.removeLastLayerStatus = true;
        this.isCreateArea = true;
        this.value = this.zoneNames;
        this.errorShow = true;
        this.typeError = 'zone';
      } else if (error.status === 401 || error.status === 403) {
        this.logout();
      }

    });

  }

  /**
   * function to update area in DB
   */
  updateAreaServer() {
    const form = {
      id: this.areaID,
      name: this.areaNames
    };
    this.zoneConstructorService.updateArea(form).subscribe(response => {
      this.getAllAreas();
      this.errorShow = false;
    }, error => {
      if (error.status === this.errorStatus || error.status === 400 ) {
        this.modalDivStatus = true;
        this.removeLastLayerStatus = true;
        this.isCreateArea = true;
        this.updateArea = true;
        this.value = this.areaNames;
        this.errorShow = true;
        this.typeError = 'group';
      } else if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }

  /**
   * function to activate create area button
   * @param type -> type zone or area
   */
  activateAreaButton(type) {
    if (type === 'Area') {
      this.isCreateArea = true;
    } else {
      this.isCreateArea = false;
    }
    this.modalDivStatus = true;
    this.modalType = type;
  }


  /**
   * function to open and close confirm modal window
   * @param status -> status of delete or not delete
   */
  closeRemoveConfirmModal(status) {
    if (status === 'yes') {
      if (this.modalTypeConfirm === 'Zone') {
        this.deleteZone(this.IDToRemove);
      } else if (this.modalTypeConfirm === 'Area') {
        this.deleteArea(this.IDToRemove);
      } else if (this.modalTypeConfirm === 'zoneFromArea') {
        this.deleteZoneFromArea(this.IDToRemove);
      }
    }
    this.modalDivConfirmStatus = false;
  }

  /**
   * function to paint zones when clicked area name
   * @param id -> id area
   */
  clickArea(id) {
    this.areaNameDivBG = id;
    this.clickAreaStatus = true;
    this.clickOnMap();
    let tempCordArray = this.getAreasZonePoints(id);
    for (let j in this.map._layers) {
      if (this.map._layers[j]._latlngs !== undefined) {
        this.map._layers[j].setStyle({color: '#47e797', weight: 2, fillColor: '#969ba3', fillOpacity: 0});
      }
    }
    this.changeAreaBorderColor('#6c2097', id);
  }


  /**
   * function to get points of zones of chosen area
   * @param id -> area id
   */
  getAreasZonePoints(id) {
    let tempCordArray = [];
    for (let i = 0; i < this.areas.length; i++) {
      if (this.areas[i].id === id) {
        for (let j = 0; j < this.areas[i].zone.length; j++) {
          tempCordArray.push(this.areas[i].zone[j].points[0]);

        }
      }
    }
    return tempCordArray;
  }

  /**
   * function to paint zone borders on map when mouse is over area name
   * @param id -> area id
   */
  mouseOver(id) {
    if (!this.clickAreaStatus || this.clickAreaStatus && this.areaNameDivBG !== id) {
      this.changeAreaBorderColor('#6c2097', id);
    }
    this.bgAreasStatus = true;
    this.areasZone = [];
    this.zoneSelectedDisable();
    this.isCheckedArr = [];
    this.verifyIsCheckedArr();
    this.areaButtonDisabled = true;
    this.checkbox = false;
    this.removeBGZone();
  }

  /**
   * function to delete  zone borders purple color from map when mouse is out of area name
   * @param id -> id area
   */
  mouseOut(id) {
    if (!this.clickAreaStatus || this.clickAreaStatus && this.areaNameDivBG !== id) {
      this.changeAreaBorderColor('#47e797', id);
    }
  }

  /**
   * function to paint zone borders on map in all cases
   * @param color -> border color
   * @param id -> area id
   */
  changeAreaBorderColor(color, id) {
    let tempCordArray = this.getAreasZonePoints(id);
    for (let i = 0; i < tempCordArray.length; i++) {
      for (let j in this.map._layers) {
        const mapLayerCordinats = this.map._layers[j]._latlngs;
        if (mapLayerCordinats !== undefined) {
          if (mapLayerCordinats[0][0].lat === tempCordArray[i]['latitude'] && mapLayerCordinats[0][0].lng === tempCordArray[i]['longitude']) {
            this.map._layers[j].setStyle({color: color, weight: 2, fillColor: '#969ba3', fillOpacity: 0});
          }
        }
      }
    }
  }

}



