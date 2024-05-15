import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Craft } from 'src/app/crafts/interfaces/craft.interface';
import { CraftsService } from 'src/app/crafts/services/crafts.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './craft-edit.component.html',
  styleUrls: ['./craft-edit.component.css'],
})
export class CraftEditComponent implements OnInit, OnDestroy, OnChanges {
  private craftsService = inject(CraftsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public loading: boolean = false;
  public firstLoading: boolean = false;
  private _craft = signal<Craft | undefined>(undefined);
  public craft = computed(() => this._craft());
  private _file = signal<File | undefined>(undefined);
  public file = computed(() => this._file());

  public myForm: FormGroup = this.fb.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    file: [, []],
  });

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
    this.firstLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.getCraft(params.get('id'));
    });
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

  getCraft(id: string | null): void {
    this.loading = true;
    this.craftsService.getCraft(id!).subscribe({
      next: (craft) => {
        this._craft.set(craft);

        this.myForm.patchValue({
          id: craft.id,
          name: craft.name,
          description: craft.description,
        });
      },
      error: (message) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  editCraft(): void {
    this.loading = true;
    const { id, name, description } = this.myForm.value;

    this.craftsService.updateCraft(id!, name, description).subscribe({
      next: (craft) => {
        if(this._file()) {
          this.craftsService.uploadCraftImage(craft.id, this.file()!).subscribe({
            next: (image) => {
              Swal.fire('Actualización', 'Actualización del elemento y su imagen correcta', 'success');
              this.router.navigateByUrl('/admin');
            },
            error: (message) => {
              Swal.fire('Error', message.toString(), 'error');
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
            },
          });
        } else {
          Swal.fire('Actualización', 'Actualización del elemento correcta', 'success');
          this.router.navigateByUrl('/admin');
        }
      },
      error: (message) => {
        Swal.fire('Error', message.toString(), 'error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this._file.set(file);
    // You can perform further actions with the selected file if needed
  }
}
