import { Component, inject, OnInit, signal } from '@angular/core';
import { Address } from '../../../core/services/address/address';
import { Address as AddressModel } from '../../../core/models/user-settings/address/address.model';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationModal } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { Region } from '../../../core/services/region/region';
import { Region as RegionModel } from '../../../core/models/region/region.model';
import { firstValueFrom } from 'rxjs';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { ValidationMessage } from '../../../shared/components/validation-message/validation-message';
import { TextArea } from '../../../shared/components/text-area/text-area';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';
import { Loading } from '../../../shared/components/loading/loading';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-addresses',
  imports: [
    ReactiveFormsModule,
    ConfirmationModal,
    TextInput,
    TextArea,
    ValidationMessage,
    LoadingButton,
    Loading,
    EmptyState,
  ],
  templateUrl: './addresses.html',
  styleUrl: './addresses.css',
})
export class Addresses implements OnInit {

  private addressService = inject(Address);
  private formBuilder = inject(NonNullableFormBuilder);
  private toastService = inject(Toast);
  
  addresses = signal<AddressModel[]>([]);

  // state loading dan error
  loading = signal(false);
  errorMessage = signal('');

  // state show form dan loading save
  showAddressForm = signal(false);
  editingAddressId = signal<number | null>(null);
  saving = signal(false);
  // digunakan untuk menghindari user klik terus terusan
  settingDefault = signal(false);

  // untuk delete modal
  deleting = signal(false);
  addressIdToDelete = signal<number | null>(null);
  showDeleteModal = signal(false);

  // forms
  addressForm = this.formBuilder.group({
    recipient_name: ['', [Validators.required, Validators.maxLength(255)]],
    phone: ['', [Validators.required, Validators.pattern(/^(\+62|08)[0-9]{8,13}$/), Validators.maxLength(20)]],
    label: ['', [Validators.required, Validators.maxLength(50)]],
    full_address: ['', [Validators.required]],
    province_id: ['', Validators.required],
    province_name: [''],
    city_id: ['', Validators.required],
    city_name: [''],
    district_id: ['', Validators.required],
    district_name: [''],
    subdistrict_id: [''],
    subdistrict_name: [''],
    postal_code: ['', [Validators.pattern(/^[0-9]{5}$/), Validators.maxLength(5)]],
    latitude: [ null as number | null ],
    longitude: [ null as number | null ],
    is_default: [false]
  })

  // Kebutuhan load daerah menggunakan raja ongkir api
  private regionService = inject(Region);

  provinces = signal<RegionModel[]>([]);
  cities = signal<RegionModel[]>([]);
  districts = signal<RegionModel[]>([]);
  subdistricts = signal<RegionModel[]>([]);

  // loading state untuk select region
  loadingProvinces = signal(false);
  loadingCities = signal(false);
  loadingDistricts = signal(false);
  loadingSubdistricts = signal(false);

  // state loading untuk form edit
  loadingForm = signal(false);


  loadAddress(): void { 

    this.loading.set(true);

    this.addressService
    .getAddresses()
    .subscribe({
      next: (response) => {
        this.addresses.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load the address. Please try again.');
        this.loading.set(false);
      }
    });
  }

  openAddressForm():void {

    this.editingAddressId.set(null);

    this.addressForm.reset({
      recipient_name: '',
      phone: '',
      label: '',
      full_address: '',

      province_id: '',
      province_name: '',

      city_id: '',
      city_name: '',

      district_id: '',
      district_name: '',

      subdistrict_id: '',
      subdistrict_name: '',

      postal_code: '',

      latitude: null,
      longitude: null,

      is_default: false
    });

    this.showAddressForm.set(true);
  }

  async openEditForm(address: AddressModel) {

    // Tampilkan form
    this.showAddressForm.set(true);

    // loading edit data
    this.loadingForm.set(true);

    // Simpan ID address yang sedang diedit
    this.editingAddressId.set(address.id);

    // Isi form dengan data address
    this.addressForm.patchValue({

      recipient_name: address.recipient_name,
      phone: address.phone,
      label: address.label,
      full_address: address.full_address,

      province_id: address.province_id,
      province_name: address.province_name,

      city_id: address.city_id,
      city_name: address.city_name,

      district_id: address.district_id,
      district_name: address.district_name,

      subdistrict_id: address.subdistrict_id ?? '',
      subdistrict_name: address.subdistrict_name ?? '',

      postal_code: address.postal_code,

      latitude: address.latitude,
      longitude: address.longitude,

      is_default: address.is_default

    });

    try {
      // 3. Load data dropdown secara berurutan
      const provinceId = address.province_id;
      const cityId = address.city_id;
      const districtId = address.district_id;

      if (provinceId) {
        const cityRes = await firstValueFrom(this.regionService.getCities(+provinceId));
        this.cities.set(cityRes.data);
      }

      if (cityId) {
        const districtRes = await firstValueFrom(this.regionService.getDistricts(+cityId));
        this.districts.set(districtRes.data);
      }

      if (districtId) {
        const subdistrictRes = await firstValueFrom(this.regionService.getSubDistricts(+districtId));
        this.subdistricts.set(subdistrictRes.data);
      }
    } catch (error) {
      console.error('Gagal memuat data wilayah edit:', error);
    } finally {
      // 4. Matikan loading form setelah semua data siap (sukses/gagal)
      this.loadingForm.set(false);
    }
  }


  closeAddressForm(): void {

    this.showAddressForm.set(false);

    this.editingAddressId.set(null);

  }

  saveAddress(): void {

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const formValue = this.addressForm.getRawValue();
    const editingId = this.editingAddressId();

    // Handle create address
    if (editingId === null) {

      this.addressService
        .createAddress(formValue)
        .subscribe({

          next: () => {
            this.saving.set(false);
            this.closeAddressForm();
            this.loadAddress();
            this.toastService.success('Address created successfully');
          },
          error: (error) => {
            console.log(error)
            this.saving.set(false);
            this.toastService.error('Failed to create address. Please try again.');
          }
        })

        return;
      }

      // Handle edit address

      this.addressService
        .updateAddress(
          editingId,
          formValue
        )
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.closeAddressForm();
            this.loadAddress();
            this.toastService.success('Address updated successfully');
          },
          error: (error) => {
            console.log(error);
            this.saving.set(false);
            this.toastService.error('Failed to update address. Please try again.');
          }
        })
  }

  setDefaultAddress(addressId: number): void {

    this.settingDefault.set(true);

    this.addressService
      .setDefaultAddress(addressId)
      .subscribe({
        next: () => {
          this.settingDefault.set(false);
          this.loadAddress();
          this.toastService.success('Address set as default successfully');
        },
        error: (error) => {
          console.log(error);
          this.settingDefault.set(false);
          this.toastService.error('Failed to set address as default. Please try again.');
        }
      })
  }

  deleteAddress(): void {

    const addressId = this.addressIdToDelete();

    if (addressId === null) {
      return;
    }

    this.deleting.set(true);

    this.addressService
      .deleteAddress(addressId)
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.closeDeleteModal();
          this.loadAddress();
          this.toastService.success('Address deleted successfully');
        },
        error: (error) => {
          console.log(error);
          this.deleting.set(false);
          this.toastService.error('Failed to delete address. Please try again.');
        }
      })
  }

  // load daerah menggunakan raja ongkir api
  loadProvinces(): void {

    this.loadingProvinces.set(true);
    
    this.regionService
      .getProvinces()
      .subscribe({
        next: (response) => {
          this.provinces.set(response.data);
          this.loadingProvinces.set(false);
        },
        error: (error) => {
          console.log(error);
          this.loadingProvinces.set(false);
        }
      })
  }

  onProvinceChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const provinceId = selectElement.value;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const provinceName = selectedOption ? selectedOption.text : '';

    // update form control untuk id dan name
    this.addressForm.patchValue({
      province_id: provinceId,
      province_name: provinceName,
      city_id: '',
      city_name: '',
      district_id: '',
      district_name: '',
      subdistrict_id: '',
      subdistrict_name: ''
    });

    this.cities.set([]);
    this.districts.set([]);
    this.subdistricts.set([]);

    if (provinceId) {
      this.loadCities(+provinceId);
    }
  }

  loadCities(provinceId: number): void {

    // Reset data sebelumnya
    this.cities.set([]);
    this.districts.set([]);
    this.subdistricts.set([]);

    // Disable city, district, subdistrict saat sedang meload data baru
    this.addressForm.get('city_id')?.disable();
    this.addressForm.get('district_id')?.disable();
    this.addressForm.get('subdistrict_id')?.disable();

    this.loadingCities.set(true);

    // Ambil kota berdasarkan provinsi
    this.regionService
      .getCities(provinceId)
      .subscribe({
        next: (response) => {
          this.cities.set(response.data);
          this.loadingCities.set(false);
          this.addressForm.get('city_id')?.enable();
        },
        error: (error) => {
          console.log(error);
          this.loadingCities.set(false);
        }
      });
  }

  onCityChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const cityId = selectElement.value;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const cityName = selectedOption ? selectedOption.text : '';

    this.addressForm.patchValue({
      city_id: cityId,
      city_name: cityName,
      district_id: '',
      district_name: '',
      subdistrict_id: '',
      subdistrict_name: ''
    });

    this.districts.set([]);
    this.subdistricts.set([]);

    if (cityId) {
      this.loadDistricts(+cityId);
    }
  }

  loadDistricts(cityId: number): void {

    // Reset data sebelumnya
    this.districts.set([]);
    this.subdistricts.set([]);

    this.addressForm.get('district_id')?.disable();
    this.addressForm.get('subdistrict_id')?.disable();

    this.loadingDistricts.set(true);

    this.regionService
      .getDistricts(cityId)
      .subscribe({
        next: (response) => {
          this.districts.set(response.data);
          this.loadingDistricts.set(false);
          this.addressForm.get('district_id')?.enable();
        },
        error: (error) => {
          console.log(error);
          this.loadingDistricts.set(false);
        }
      });
  }

  onDistrictChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const districtId = selectElement.value;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const districtName = selectedOption ? selectedOption.text : '';

    this.addressForm.patchValue({
      district_id: districtId,
      district_name: districtName,
      subdistrict_id: '',
      subdistrict_name: ''
    });

    this.subdistricts.set([]);

    if (districtId) {
      this.loadSubdistricts(+districtId);
    }
  }

  loadSubdistricts(districtId: number): void {

    this.subdistricts.set([]);

    this.addressForm.get('subdistrict_id')?.disable();

    this.loadingSubdistricts.set(true);

    this.regionService
      .getSubDistricts(districtId)
      .subscribe({
        next: (response) => {
          this.subdistricts.set(response.data);
          this.loadingSubdistricts.set(false);
          this.addressForm.get('subdistrict_id')?.enable();
        },
        error: (error) => {
          console.log(error);
          this.loadingSubdistricts.set(false);
        }
      });
  }

  onSubdistrictChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const subdistrictId = selectElement.value;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const subdistrictName = selectedOption ? selectedOption.text : '';

    this.addressForm.patchValue({
      subdistrict_id: subdistrictId,
      subdistrict_name: subdistrictName
    });
  }

  // Untuk delete modal
  openDeleteModal(addressId: number): void {
    this.addressIdToDelete.set(addressId);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.addressIdToDelete.set(null);
    this.showDeleteModal.set(false);
  }


  ngOnInit(): void {
    this.loadAddress();
    this.loadProvinces();
  }
}
