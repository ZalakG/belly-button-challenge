// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Display the dashboard
function init() {
  
  // Use D3 library to select dropdown menu
  let dropDown = d3.select("#selDataset");

  // Get sample names and populate the drowdown
  d3.json(url).then((data) => {
    console.log("Data : ${data}");

    // Create an array of id names
    let names = data.names;

    // Itereate through the array
    names.forEach((id) => {
      console.log(id);
      
      // Append each name as an option to dropdown menu    
      dropDown.append("option").text(id).property("value", id);

    });

    // Set the first name to the list
    let sample = names[0];
    console.log(sample);

    // Call the funcitons to build the initial plots (panel, bar , bubble)
    buildMetadata(sample);
    buildBar(sample);
    buildBubble(sample);
    buildGuage(sample);  
     
  });

};

// Make demographic info panel
function buildMetadata(selectedSample) {

// Fetch the json data and console log it
  d3.json(url).then((data) => {
    
    // Get all metadata
    let metadata = data.metadata;

    // Filter the data because the metadata id is in integer and samplevalue is string type
    let value = metadata.filter(meta => meta.id == selectedSample);
    console.log(value)

    // Get the first value from the array
    let dataValue = value[0];

    // Clear the metadata element
    d3.select("#sample-metadata").html("");

    // Use Object.entries built-in method in JS to add each key/value pair
    Object.entries(dataValue).forEach(([key,value]) => {

      // Log the individual key/value pairs as they are being appended to the metadata panel
      console.log(key,value);

      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);

    });   

  });
  
};

//////////////  Build  Bar Chart //////////

function buildBar(selectedSample) {

  d3.json(url).then((data) => {

    let sampleData = data.samples;

    // fileter based on value of selected sample
    let value = sampleData.filter(result => result.id == selectedSample);

    let dataValue = value[0];

    // get the otu_id, lables and sample values
    let otu_ids = dataValue.otu_ids;
    let otu_labels = dataValue.otu_labels;
    let sample_values = dataValue.sample_values;

    console.log(otu_ids,otu_labels,sample_values);

     // Set top ten items to display in descending order
     
     let xdata = sample_values.slice(0,10).reverse();
     let ydata = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
     let labels = otu_labels.slice(0,10).reverse();

     // set up the trace for bar chart
     let bartrace = {
      x: xdata,
      y: ydata,
      text: labels,
      type: "bar",
      orientation: 'h'
     };

     // Plot the bar chart
     Plotly.newPlot("bar",[bartrace]);

  });
};

//----------------------------------------//
//////////  Build Bubble chart /////////////
//---------------------------------------//

function buildBubble(selectedSample) {

  d3.json(url).then((data) => {

    let sampleData = data.samples;

    // fileter based on value of selected sample
    let value = sampleData.filter(result => result.id == selectedSample);

    let dataValue = value[0];

    // get the otu_id, lables and sample values
    let otu_ids = dataValue.otu_ids;
    let otu_labels = dataValue.otu_labels;
    let sample_values = dataValue.sample_values;

    console.log(otu_ids,otu_labels,sample_values);
     
     // set up the trace for bar chart
     let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }

     };
     let layout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
  };

     // Plot the bar chart
     Plotly.newPlot("bubble",[bubbleTrace],layout);

  });
};

///------------------------------------------///
//////// Build Guage Chart ////////////////////
///-----------------------------------------///

function buildGuage(selectedSample) {
  d3.json(url).then((data) => {
    
    // Get all metadata
    let metadata = data.metadata;

    // Filter the data because the metadata id is in integer and samplevalue is string type
    let value = metadata.filter(meta => meta.id == selectedSample);

    // Access the index 0 from the array
    let dataValue = value[0];

    let washFreq = Object.values(dataValue)[6];

    // Plot the guage chart
    let guageTrace = {
      domain: {x: [0,1], y: [0,1]},
      value: washFreq,
      title: {
        text: "<b>Belly Button Cleaning Frequency</b><br>(Scrubs per Week)",
        font: {color: "black", size: 16}
    },      
    type: "indicator",
    mode: "gauge+number",            
    gauge: {
        axis: {range: [0, 10], tickmode: "linear", tick0: 2, dtick: 2},
        bar: {color: "steelblue"},
        steps: [
            {range: [0, 1], color: "white"},
            {range: [1, 2], color: "whitesmoke"},
            {range: [2, 3], color: "white"},
            {range: [3, 4], color: "whitesmoke"},
            {range: [4, 5], color: "white"},
            {range: [5, 6], color: "whitesmoke"},
            {range: [6, 7], color: "white"},
            {range: [7, 8], color: "whitesmoke"},
            {range: [8, 9], color: "white"},
            {range: [9, 10], color: "whitesmoke"},
        ]
    }
};

// set up the layout
let layout = {
    width: 400,
    height: 400, 
    margin: {t: 0, b:0}
};

// call Plotly to plot the gauge chart on the page
Plotly.newPlot("gauge", [guageTrace], layout);
});
};


//// Function which updates the dashboard when a new sample is selected ////
///---------------------------------------------------------------------//// 
function optionChange(selectedSample) {

  // log the new value
  console.log(selectedSample);

  // call all th functions
  buildMetadata(selectedSample);
  buildBar(selectedSample);
  buildBubble(selectedSample);
  buildGuage(selectedSample);
};

// call th einitialize funcion
init();

