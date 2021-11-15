function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    // Use the list of sample names to populate the select options/ drop down list
    d3.json("samples.json").then((data) => {
      // console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      //this populates the demographic table 
      buildMetadata(firstSample);
    });
  }
  
  // // Initialize the dashboard
  // init();
  
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  }  
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);    
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    
    });
  }
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // console.log(sample);
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // console.log(data);
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var resultsArray = samples.filter(sampleObj => sampleObj.id == sample);
      var results = resultsArray[0];
      // console.log(results);
      //  5. Create a variable that holds the first sample in the array.
      var firstSample = samples[0];
  
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      
      var ids = results.otu_ids;
      var labels = results.otu_labels;
      var values = results.sample_values;
      // Additional variables for chart formatting
      var size = data.sample_values;
      var color = data.otu_ids;
      
  
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks =  ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      // console.log(yticks);
  
  
  // *****************************************************************************
  // Deliverable 1 Bar Chart
  // *****************************************************************************
  
  
      // 8. Create the trace for the bar chart. 
      var bar_data =[
        {
          y:ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
          x:values.slice(0,10).reverse(),
          text:labels.slice(0,10).reverse(),
          type:"bar",
          orientation:"h"
  
        }
      ];
        
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: { text: '<b>Top 10 Bacteria Cultures Found</b>', font: { size: 18 } },
        xaxis: { title: "<b>Sample Values</b>"},
        yaxis: { title: "<b>OTU IDs</b>"}
       
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", bar_data, barLayout);
  // *****************************************************************************
  // Deliverable 2 Bubble Chart
  // *****************************************************************************
      // 1. Create the trace for the bubble chart.
      var bubbleData = [
        {
          x:ids,
          y:values,
          text: labels,
          mode: 'markers',
          marker: {
            color: ids,
            size: values,
            colorscale: 'RdBu'
          }
        }
        // var data = [bubbleData];
      ];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: { text: '<b>Bacteria Cultures Per Sample</b>', font: { size: 18 } },
        xaxis: {title: "<b>OTD IDs</b>"},
        // yaxis: {title: "Sample Values"},
        hovermode: "closest"
              
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      
  // *********************************************************************************
  // Deliverable 3 Gauge
  // *********************************************************************************
      //  1. Create a variable that filters the metadata array for the object with the desired sample number.
      var newSamples = data.metadata;
      var sampleArray = newSamples.filter(sampleObj => sampleObj.id == sample);
       
      // 2. Create a variable that holds the first sample in the metadata array.
      var findings = sampleArray[0];
      console.log(findings);
  
      // 3. Create a variable that holds the washing frequency.
       var floatWfreq = parseFloat(findings.wfreq);
      console.log(floatWfreq)
        
  
      // 4. Create the trace for the gauge chart.
      var gaugeData = [
        {
          type: "indicator",
          mode: "gauge+number",
          domain: { x: [0, 1], y: [0, 1] },
          value: floatWfreq,
          title: { text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week', font: { size: 18 } },
          gauge: {
            axis: { range: [null, 9],tickwidth: 1, tickcolor: "black" },
            bar: { color: "black" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 2], color: 'red' },
              { range: [2, 4], color: 'orange'},
              { range: [4, 6], color: 'yellow'},
              { range: [6, 8], color: 'greenyellow'},
              { range: [8, 10], color: 'green'}            
            ],
           
          }
        }
       
      ];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        font: { color: "black", family: "Arial" }
       
      };
  
      
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
    });
  }
  
  // Initialize the dashboard
  init();
  