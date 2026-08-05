import { Component, computed, input } from '@angular/core';

interface StatusConfig {
    label: string;
    class: string;
}

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})

export class StatusBadge {

  status = input.required<string>();

  private statusConfig: Record<string, StatusConfig> = {

    pending: { 
      label: 'Pending', 
      class: 'bg-yellow-100 text-yellow-800' 
    },
    processing: { 
      label: 'Processing', 
      class: 'bg-blue-100 text-blue-800' 
    },
    completed: { 
      label: 'Completed', 
      class: 'bg-green-100 text-green-800' 
    },
    cancelled: { 
      label: 'Cancelled', 
      class: 'bg-red-100 text-red-800' 
    },

  };
  
  config = computed(() => {
    return this.statusConfig[this.status()] ?? {

      label: this.status(),

      class: 'bg-gray-100 text-gray-800'
    }
  })

}
