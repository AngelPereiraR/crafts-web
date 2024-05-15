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
import { Router } from '@angular/router';
import { CraftsService } from 'src/app/crafts/services/crafts.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './craft-add.component.html',
  styleUrls: ['./craft-add.component.css'],
})
export class CraftAddComponent implements OnInit, OnDestroy, OnChanges {
  private craftsService = inject(CraftsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public loading: boolean = false;
  public firstLoading: boolean = false;
  private _file = signal<File | undefined>(undefined);
  public file = computed(() => this._file());

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    file: [, [Validators.required]],
  });

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
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

  addCraft(): void {
    this.loading = true;
    const { name, description } = this.myForm.value;

    this.craftsService.addCraft(name, description).subscribe({
      next: (craft) => {
        this.craftsService.uploadCraftImage(craft.id, this.file()!).subscribe({
          next: (image) => {
            Swal.fire('Creación', 'Creación del elemento correcta', 'success');
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
