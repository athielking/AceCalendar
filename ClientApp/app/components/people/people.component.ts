import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

import { AssetService } from '../../services/asset.service';

import { Worker } from '../calendar/common/models';

@Component({
    selector: 'people',
    templateUrl: './people.component.html'
})
export class PeopleComponent implements OnInit {
    
    constructor(
        private assetService: AssetService
    ) {
    }

    configColumns: ITdDataTableColumn[] = [
      { name: 'name',  label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
      { name: 'phone', label: 'Phone Number' }
    ];
  
    workers: Worker[];
   
    ngOnInit(){
        //Get page
        this.assetService.getWorkers().subscribe(result => {
            this.workers = result;
        })
    }
  }

