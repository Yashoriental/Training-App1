import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  standalone: false,
  selector: 'app-show-details',
  templateUrl: './show-details.page.html',
  styleUrls: ['./show-details.page.scss'],
})
export class ShowDetailsPage implements OnInit {
  userData: any;
  users: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private sqliteServices: SqliteService) {}

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(() => {
      const nav = this.router.getCurrentNavigation();
      if (nav?.extras?.state && nav.extras.state['userData']) {
        this.userData = nav.extras.state['userData'];
        console.log('User Data on Details Page:', this.userData);
      }
    });
    this.users = await this.sqliteServices.getAllUser();
    console.log(this.users)
  }
}
