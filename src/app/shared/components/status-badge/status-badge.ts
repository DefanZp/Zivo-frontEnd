import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {

  status = input.required<string>();

  badgeClass = computed (() => {
    switch (this.status()) {

      case 'pending':
      return 'bg-yellow-100 text-yellow-800';

      case 'processing':
        return 'bg-blue-100 text-blue-800';

      case 'completed':
        return 'bg-green-100 text-green-800';

      case 'cancelled':
        return 'bg-red-100 text-red-800';

      default:
        return 'bg-gray-100 text-gray-800';

      }
  })

  label = computed(() => {

  switch (this.status()) {

    case 'pending':
      return 'Pending';

    case 'processing':
      return 'Processing';

    case 'completed':
      return 'Completed';

    case 'cancelled':
      return 'Cancelled';

    default:
      return this.status();

  }

});

}
