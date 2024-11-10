const fs = require('fs');
const xml2js = require('xml2js');

// Function to parse and write XML data to separate files
function parseAndWriteXML(xmlData, index) {
  const parser = new xml2js.Parser();
  parser.parseString(xmlData, (err, result) => {
    if (err) {
      console.error(`Error parsing XML document ${index}: ${err.message}`);
    } else {
      // Convert the parsed XML to a JSON object
      const jsonResult = JSON.stringify(result, null, 2);

      // Write the JSON data to a separate file
      fs.writeFileSync(`abEntryNote${index}.json`, jsonResult, 'utf-8');
      console.log(`XML document ${index} parsed and saved as abEntryNote${index}.json`);
    }
  });
}

// Read the input XML file
fs.readFile('AbEntryNotes_master.xml', 'utf-8', (err, data) => {
  if (err) {
    console.error(`Error reading the input XML file: ${err.message}`);
  } else {
    // Split the XML data into separate documents (assuming each document is separated by </root>)
    const xmlDocuments = data.split('</O>');
    xmlDocuments.forEach((xmlDocument, index) => {
      if (xmlDocument.trim() !== '') {
        // Add back the root element
        const completeXmlDocument = `${xmlDocument.trim()}</O>`;
        parseAndWriteXML(completeXmlDocument, index + 1);
      }
    });
  }
});
