// Define types
type PixelMatrix = [number, number, number][][]; // 2D array of RGB tuples

function onOpen(): void {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Custom Menu")
    .addItem("Upload Image", "openImageUploaderSidebar")
    .addToUi();
}

function openImageUploaderSidebar(): void {
  const html = HtmlService.createHtmlOutputFromFile(
    "uploadImage.html"
  ).setTitle("Upload & Process Image");
  SpreadsheetApp.getUi().showSidebar(html);
}

// For testing
function resizeCells(): void {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (!sheet) {
    throw new Error("No active sheet found.");
  }

  const cellSize = 10; // Adjust as needed
  const width = sheet.getMaxColumns();
  const height = sheet.getMaxRows();

  for (let i = 1; i <= height; i++) {
    sheet.setRowHeight(i, cellSize);
  }
  for (let j = 1; j <= width; j++) {
    sheet.setColumnWidth(j, cellSize);
  }
}

function resetSheetFormatting(): void {
  const sheet: GoogleAppsScript.Spreadsheet.Sheet =
    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (!sheet) return;

  const range: GoogleAppsScript.Spreadsheet.Range = sheet.getDataRange();
  const numCols: number = sheet.getMaxColumns();
  const numRows: number = sheet.getMaxRows();

  // Reset column widths
  for (let col = 1; col <= numCols; col++) {
    sheet.setColumnWidth(col, 100); // Default width
  }

  // Reset row heights
  for (let row = 1; row <= numRows; row++) {
    sheet.setRowHeight(row, 21); // Default height
  }

  // Clear background colors
  range.setBackground(null);

  // Clear formatting (optional)
  range.clearFormat();

  // Optionally clear content and notes (Uncomment if needed)
  // range.clearContent();
  // range.clearNote();

  Logger.log("Sheet formatting reset successfully.");
}

/**
 * Use the pixel data to resize the sheet and apply the colors
 */
function applyPixelDataToSheet(pixelData: PixelMatrix): void {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (!sheet) {
    throw new Error("No active sheet found.");
  }

  // clear existing formats
  resetSheetFormatting();
  SpreadsheetApp.flush();

  const height: number = pixelData.length;
  const width: number = pixelData[0].length;

  // Ensure the sheet has enough rows and columns
  const currentRows = sheet.getMaxRows();
  const currentCols = sheet.getMaxColumns();

  if (height > currentRows) {
    sheet.insertRowsAfter(1, height - currentRows);
  }
  if (width > currentCols) {
    sheet.insertColumnsAfter(1, width - currentCols);
  }

  // Set cell size
  const cellSize = 10; // Adjust as needed
  for (let i = 1; i <= height; i++) {
    sheet.setRowHeight(i, cellSize);
  }
  for (let j = 1; j <= width; j++) {
    sheet.setColumnWidth(j, cellSize);
  }

  // Get the range of cells
  const range = sheet.getRange(1, 1, height, width);
  const backgrounds: string[][] = [];

  for (let i = 0; i < height; i++) {
    const rowColors: string[] = [];
    for (let j = 0; j < width; j++) {
      const rgb: [number, number, number] = pixelData[i][j]; // Expecting [r, g, b]
      const color = rgbToHex(rgb[0], rgb[1], rgb[2]);
      rowColors.push(color);
    }
    backgrounds.push(rowColors);
  }

  // Apply background colors to the range
  range.setBackgrounds(backgrounds);
}

// Helper function to convert RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
