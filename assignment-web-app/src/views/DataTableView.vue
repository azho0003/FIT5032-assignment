<template>
    <div class="container mt-5">
      <h2 class="row mb-4">Car Information Tables</h2>
  
      <div class="mb-5">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h3>Basic Car Information</h3>
            <div>
                <button class="btn btn-success me-2" @click="exportToCSV(basicRows, 'basic_car_data.csv')">Export CSV</button>
                <button class="btn btn-danger" @click="exportToPDF('basic')">Export PDF</button>
            </div>
        </div>
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
  
      <div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h3>Detailed Car Information</h3>
            <div>
                <button class="btn btn-success me-2" @click="exportToCSV(filteredDetailedRows, 'detailed_car_data.csv')">Export CSV</button>
                <button class="btn btn-danger" @click="exportToPDF('detailed')">Export PDF</button>
            </div>
        </div>
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
import { ref, computed } from 'vue';
import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import { basicCarData, detailedCarData } from '../data/mockData.js';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
        }];

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

        // Computed property for filtered detailed rows
        const filteredDetailedRows = computed(() => {
            return detailedRows.value.filter((row) => {
                return Object.keys(columnFilters.value).every((field) => {
                return row[field]
                    .toString()
                    .toLowerCase()
                    .includes(columnFilters.value[field].toLowerCase());
                });
            });
        });

        // Function to handle per-column search
        const handleColumnSearch = (field) => {
        const filterValue = columnFilters.value[field].toLowerCase();
        detailedRows.value = detailedCarData.filter((row) =>
            row[field].toString().toLowerCase().includes(filterValue));
        };

        // Export to CSV Function
        const exportToCSV = (data, filename) => {
            if (!data || data.length === 0) {
                alert('No data available to export.');
                return;
            }

            const separator = ',';
            const keys = Object.keys(data[0]);

            const csvContent =
                keys.join(separator) + '\n' + data.map((row) => {
                    return keys.map((key) => {
                        let cell = row[key] === null || row[key] === undefined ? '' : row[key];
                        cell = cell.toString().replace(/"/g, '""');

                        if (cell.search(/("|,|\n)/g) >= 0) {
                        cell = `"${cell}"`;
                        }
                        return cell;
                    })
                    .join(separator);
                })
                .join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, filename);
        };

        // Export to PDF Function
        const exportToPDF = (tableType) => {
            const doc = new jsPDF();

            let columns = [];
            let rows = [];

            if (tableType === 'basic') {
                columns = basicColumns.map((col) => col.label);
                rows = basicRows.value.map((row) => Object.values(row));
                doc.text('Basic Car Information', 14, 15);
            } else if (tableType === 'detailed') {
                columns = detailedColumns.map((col) => col.label);
                rows = filteredDetailedRows.value.map((row) => Object.values(row));
                doc.text('Detailed Car Specifications', 14, 15);
            } else {
                console.error('Invalid table type for PDF export.');
                return;
            }

            doc.autoTable({
                startY: 20,
                head: [columns],
                body: rows,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [22, 160, 133] },
            });

            doc.save(`${tableType}_car_data.pdf`);
        };


        return {
        basicColumns,
        basicRows,
        detailedColumns,
        detailedRows,
        columnFilters,
        handleColumnSearch,
        exportToCSV,
        exportToPDF
        };
    },
};
</script>
  
  