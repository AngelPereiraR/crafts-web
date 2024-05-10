import { Component, DoCheck, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CraftsService } from '../../services/crafts.service';

@Component({
  selector: 'crafts-layout',
  templateUrl: './crafts-layout.component.html',
  styleUrls: ['./crafts-layout.component.scss'],
})
export class CraftsLayoutComponent implements DoCheck {
  private authService = inject(AuthService);
  private craftsService = inject(CraftsService);

  currentUser = this.authService.currentUser;
  page: null | string = null;

  public scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo(0, section.offsetTop - 150);
    }
  }

  ngDoCheck() {
    let currentPage = this.craftsService.currentPage;
    this.page = currentPage();
    this.currentUser = this.authService.currentUser;
  }

  logout() {
    this.authService.logout();
  }
}
