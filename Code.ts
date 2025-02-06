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

function applyPixelDataToSheet(pixelData: PixelMatrix): void {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (!sheet) {
    throw new Error("No active sheet found.");
  }

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
