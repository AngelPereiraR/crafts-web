import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Craft } from 'src/app/crafts/interfaces/craft.interface';
import { CraftsService } from 'src/app/crafts/services/crafts.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './craft-table.component.html',
  styleUrls: ['./craft-table.component.css'],
})
export class CraftTableComponent implements OnInit, OnDestroy, OnChanges {
  private craftsService = inject(CraftsService);
  private router = inject(Router);
  private _crafts = signal<Craft[] | undefined>(undefined);
  public crafts = computed(() => this._crafts());
  private _position = signal<number>(0);
  public position = computed(() => this._position());
  private _totalCrafts = signal<number>(0);
  public totalCrafts = computed(() => this._totalCrafts());
  public totalPages: number = 0;
  public loading: boolean = false;
  public firstLoading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getCrafts(this.position());
  }

  ngOnInit(): void {
    this.craftsService.setPage('admin');
  }

  ngOnDestroy(): void {
    this.craftsService.setPage('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  getPageNumbers(): number[] {
    this.totalPages = Math.ceil(this.totalCrafts() / 8);
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  async getCrafts(position: number): Promise<void> {
    this.loading = true;
    if(position <= this.totalPages - 1 && position >= 0) {
      this._position.set(position);
    }
    this.craftsService.getCrafts().subscribe({
      next: (crafts) => {
        this._totalCrafts.set(crafts.length);
        for (let i = 0; i <= this.position(); i++) {
          let craftsList: Craft[] = [];
          for (let j = 0; j < 8; j++) {
            if(crafts[8 * i + j] !== undefined && i <= this.position()) {
              craftsList.push(crafts[8 * i + j]);
            }
          }
          this._crafts.set(craftsList);
        }
      },
      error: (message) => {
        this.loading = false;
        this.firstLoading = false;
      },
      complete: () => {
        this.loading = false;
        this.firstLoading = false;
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
    });
  }

  removeCraft(id: string | null): void {
    this.loading = true;
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.craftsService.removeCraft(id!).subscribe({
          error: (message) => {
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
            this.getCrafts(this.position());
            this.ngOnChanges({});
          },
        });
      } else {
        this.loading = false;
      }
    });
  }

  editNavigate(id: string): void {
    this.router.navigateByUrl(`/admin/edit/${id}`)
  }
}
