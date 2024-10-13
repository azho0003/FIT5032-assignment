<template>
    <div class="container mt-5">
      <h2 class="row mb-4">Car Information Tables</h2>
  
      <!-- Table 1: Basic Car Information -->
      <div class="mb-5">
        <h3>Basic Car Information</h3>
        <vue-good-table
          :columns="basicColumns"
          :rows="basicRows"
          :search-options="{
            enabled: true,
            placeholder: 'Search all columns...',
          }"
          :pagination-options="{
            enabled: true,
            perPage: 10,
          }"
          :sort-options="{
            enabled: true,
          }"
        >
          <template #table-row="props">
            <span>{{ props.formattedRow[props.column.field] }}</span>
          </template>
        </vue-good-table>
      </div>
  
      <!-- Table 2: Detailed Car Specifications -->
      <div>
        <h3>Detailed Car Specifications</h3>
        <vue-good-table
          :columns="detailedColumns"
          :rows="detailedRows"
          :search-options="{
            enabled: true,
            placeholder: 'Search all columns...',
          }"
          :pagination-options="{
            enabled: true,
            perPage: 10,
          }"
          :sort-options="{
            enabled: true,
          }"
          :global-search="false"
        >
          <!-- Per-Column Search -->
          <template #table-filter="props">
            <div class="d-flex">
              <div v-for="column in props.columns" :key="column.field" class="me-3">
                <input
                  v-if="column.filterable"
                  type="text"
                  class="form-control form-control-sm"
                  :placeholder="`Search ${column.label}`"
                  v-model="columnFilters[column.field]"
                  @input="handleColumnSearch(column.field)"
                />
              </div>
            </div>
          </template>
  
          <template #table-row="props">
            <span>{{ props.formattedRow[props.column.field] }}</span>
          </template>
        </vue-good-table>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { VueGoodTable } from 'vue-good-table-next';
  import 'vue-good-table-next/dist/vue-good-table-next.css';
  import { basicCarData, detailedCarData } from '../data/mockData.js';
  
  export default {
    name: 'DataTable',
    components: {
      VueGoodTable,
    },
    setup() {
      // Basic Car Information Columns
      const basicColumns = [
        {
          label: 'Make',
          field: 'make',
          sortable: true,
          filterable: true,
        },
        {
          label: 'Model',
          field: 'model',
          sortable: true,
          filterable: true,
        },
        {
          label: 'Year',
          field: 'year',
          type: 'number',
          sortable: true,
          filterable: true,
        },
        {
          label: 'Color',
          field: 'color',
          sortable: true,
          filterable: true,
        },
      ];
  
      // Detailed Car Specifications Columns
      const detailedColumns = [
        {
          label: 'Make',
          field: 'make',
          sortable: true,
          filterable: true,
        },
        {
          label: 'Model',
          field: 'model',
          sortable: true,
          filterable: true,
        },
        {
          label: 'Engine Type',
          field: 'engineType',
          sortable: true,
          filterable: true,
        },
        {
          label: 'Horsepower',
          field: 'horsepower',
          type: 'number',
          sortable: true,
          filterable: true,
        },
        {
          label: 'Transmission',
          field: 'transmission',
          sortable: true,
          filterable: true,
        },
        {
          label: 'Fuel Efficiency',
          field: 'fuelEfficiency',
          sortable: true,
          filterable: true,
        },
      ];
  
      // Rows Data
      const basicRows = ref(basicCarData);
      const detailedRows = ref(detailedCarData);
  
      // Per-Column Filters for Detailed Table
      const columnFilters = ref({
        make: '',
        model: '',
        engineType: '',
        horsepower: '',
        transmission: '',
        fuelEfficiency: '',
      });
  
      // Function to handle per-column search
      const handleColumnSearch = (field) => {
        const filterValue = columnFilters.value[field].toLowerCase();
        detailedRows.value = detailedCarData.filter((row) =>
          row[field].toString().toLowerCase().includes(filterValue)
        );
      };
  
      return {
        basicColumns,
        basicRows,
        detailedColumns,
        detailedRows,
        columnFilters,
        handleColumnSearch,
      };
    },
  };
  </script>
  
  