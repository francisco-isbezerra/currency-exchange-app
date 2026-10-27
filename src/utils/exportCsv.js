import Papa from 'papaparse';

/**
 * Export an array of objects to a CSV file download
 * @param {Object[]} data - Array of row objects
 * @param {string} filename - File name (without extension)
 */
export function exportToCsv(data, filename = 'hermes_export') {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
