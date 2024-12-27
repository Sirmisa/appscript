// function doGet() {
//   return HtmlService.createHtmlOutputFromFile('index')
//       .setTitle('BEx AI Form')
//       .setFaviconUrl('https://www.google.com/favicon.ico');
// }

function doGet() {
  var template = HtmlService.createTemplateFromFile("index");
  var html = template.evaluate();
  html.setTitle("xXVentanaXx").setWidth(950).setHeight(650);
  SpreadsheetApp.getUi().showModalDialog(html, "something");
}

function getBuildingBlocks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Building Block');
  const range = sheet.getRange('A2:A' + sheet.getLastRow());
  const values = range.getValues().filter(row => row[0] !== '');
  return values.map(row => row[0]);
}

function getActivitiesByBuildingBlock(buildingBlock) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DefActividades');
  const data = sheet.getDataRange().getValues();
  const headerRow = data[1];
  
  // Find the columns for each building block
  const buildingBlockColumns = {
    'execution': headerRow.indexOf('execution'),
    'technology': headerRow.indexOf('technology'),
    'bex ai': headerRow.indexOf('bex ai')
  };

  // Filter activities based on the selected building block
  const activities = data.slice(1)
    .filter(row => row[buildingBlockColumns[buildingBlock.toLowerCase()]] === true)
    .map(row => row[0]);

  return [...new Set(activities)]; // Remove duplicates
}

function getActivityConfig(buildingBlock, activity) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DefActividades');
  const data = sheet.getDataRange().getValues();
  
  // Find the row for the selected activity
  const activityRow = data.find(row => row[0] === activity);
  if (!activityRow) return null;

  // Get the configuration based on checkbox values
  return {
    showAmbiente: activityRow[data[1].indexOf('ambiente')] === true,
    showServicio: activityRow[data[1].indexOf('Servicio')] === true,
    showPlataforma: activityRow[data[1].indexOf('Plataforma')] === true
  };
}

function getAmbienteOptions() {
  return getOptionsFromSheet('Ambiente');
}

function getServicioOptions() {
  return getOptionsFromSheet('Servicio');
}

function getPlataformaOptions() {
  return getOptionsFromSheet('Plataforma');
}

function getOptionsFromSheet(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getRange('A2:B' + sheet.getLastRow()).getValues()
    .filter(row => row[0] !== '');
  
  return data.map(row => ({
    value: row[0].toLowerCase(),
    text: row[0]
  }));
}

function getAvailableTags(buildingBlock, activity, ambiente, servicio, plataforma) {
  const tags = [];

  // Get activity-related tags
  const activitySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DefActividades');
  const activityData = activitySheet.getDataRange().getValues();
  
  // Get all rows that match the activity name as there might be multiple entries
  const activityRows = activityData.filter(row => row[0] === activity);
  
  // Add all tags for this activity
  activityRows.forEach(row => {
    if (row[2]) { // Check if there's a tag in the Etiqueta column
      tags.push(row[2]);
    }
  });

  // Add ambiente tag if selected
  if (ambiente) {
    const ambienteSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ambiente');
    const ambienteData = ambienteSheet.getRange('A2:B' + ambienteSheet.getLastRow()).getValues();
    const ambienteRow = ambienteData.find(row => row[0].toLowerCase() === ambiente.toLowerCase());
    if (ambienteRow) {
      tags.push(ambienteRow[1]); // Etiqueta column
    }
  }

  // Add servicio tag if selected
  if (servicio) {
    const servicioSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Servicio');
    const servicioData = servicioSheet.getRange('A2:B' + servicioSheet.getLastRow()).getValues();
    const servicioRow = servicioData.find(row => row[0].toLowerCase() === servicio.toLowerCase());
    if (servicioRow) {
      tags.push(servicioRow[1]); // Etiqueta column
    }
  }

  // Add plataforma tag if selected
  if (plataforma) {
    const plataformaSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Plataforma');
    const plataformaData = plataformaSheet.getRange('A2:B' + plataformaSheet.getLastRow()).getValues();
    const plataformaRow = plataformaData.find(row => row[0].toLowerCase() === plataforma.toLowerCase());
    if (plataformaRow) {
      tags.push(plataformaRow[1]); // Etiqueta column
    }
  }

  return tags.filter(tag => tag); // Remove any undefined/empty tags
}

function saveTags(tags) {
  // Implement tag saving logic here
  // You might want to save them to a specific sheet or take other actions
  Logger.log('Tags saved:', tags);
  return true;
}
