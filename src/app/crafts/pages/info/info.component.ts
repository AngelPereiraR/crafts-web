import { ChangeDetectorRef, Component, SimpleChanges, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Craft } from '../../interfaces/craft.interface';
import { CraftsService } from '../../services/crafts.service';
import { NgxMasonryOptions } from 'ngx-masonry';

@Component({
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent {
  private craftsService = inject(CraftsService);
  public loading: boolean = false;
  public firstLoading: boolean = false;
  private _crafts = signal<Craft[] | undefined>(undefined);
  public crafts = computed(() => this._crafts());

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
    this.firstLoading = true;
    this.route.paramMap.subscribe((_) => {
      this.getCrafts();
    });
  }

  ngOnInit(): void {
    this.craftsService.setPage('user');
  }

  ngOnDestroy(): void {
    this.craftsService.setPage('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  getCrafts(): void {
    this.loading = true;
    this.craftsService.getCrafts().subscribe({
      next: (crafts) => {
        this._crafts.set(crafts);
      },
      error: (message) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
