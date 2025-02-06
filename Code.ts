type PixelMatrix = number[][];

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Custom Menu")
    .addItem("Upload Image", "openImageUploaderSidebar")
    .addToUi();
}

function openImageUploaderSidebar() {
  var html = HtmlService.createHtmlOutputFromFile("uploadImage.html").setTitle(
    "Upload & Process Image"
  );
  SpreadsheetApp.getUi().showSidebar(html);
}

function applyPixelDataToSheet(pixelData: PixelMatrix) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var height = pixelData.length;
  var width = pixelData[0].length;

  // Resize sheet
  sheet.insertRowsAfter(1, height - sheet.getMaxRows());
  sheet.insertColumnsAfter(1, width - sheet.getMaxColumns());

  // Set cell size
  var cellSize = 10; // Adjust as needed
  for (var i = 1; i <= height; i++) {
    sheet.setRowHeight(i, cellSize);
  }
  for (var j = 1; j <= width; j++) {
    sheet.setColumnWidth(j, cellSize);
  }

  // Apply colors
  var range = sheet.getRange(1, 1, height, width);
  var backgrounds = [];

  for (var i = 0; i < height; i++) {
    var rowColors = [];
    for (var j = 0; j < width; j++) {
      var rgb = pixelData[i][j];
      var color = rgbToHex(rgb[0], rgb[1], rgb[2]);
      rowColors.push(color);
    }
    backgrounds.push(rowColors);
  }

  range.setBackgrounds(backgrounds);
}

function rgbToHex(r: Number, g: Number, b: Number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
