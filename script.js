// Wrrapped alll code ib an async function to use await feature

const start = async () => {
  // api key
  const apiKey = ""//"3b064e329128448f842b05c903a7499c";

  if(apiKey.length == 0) {
    document.getElementById("loading").remove();
    alert("There is no api key, please add it!!!");
    return;
  }

  const sectors = [
    { code: "CEU0000000001", name: "Total nonfarm" },
    { code: "CEU0500000001", name: "Total private" },
    { code: "CEU0600000001", name: "Goods-producing" },
    { code: "CEU0700000001", name: "Service-providing" },
    { code: "CEU0800000001", name: "Private service-providing" },
    { code: "CEU1000000001", name: "Mining and logging" },
    { code: "CEU2000000001", name: "Construction" },
    { code: "CEU3000000001", name: "Manufacturing" },
    { code: "CEU3100000001", name: "Durable Goods" },
    { code: "CEU3200000001", name: "Nondurable Goods" },
    { code: "CEU4000000001", name: "Trade, transportation, and utilities" },
    { code: "CEU4100000001", name: "Wholesale trade" },
    { code: "CEU4200000001", name: "Retail trade" },
    { code: "CEU4300000001", name: "Transportation and warehousing" },
    { code: "CEU4400000001", name: "Utilities" },
    { code: "CEU5000000001", name: "Information" },
    { code: "CEU5500000001", name: "Financial activities" },
    { code: "CEU6000000001", name: "Professional and business services" },
    { code: "CEU6500000001", name: "Education and health services" },
    { code: "CEU7000000001", name: "Leisure and hospitality" },
    { code: "CEU8000000001", name: "Other services" },
    { code: "CEU9000000001", name: "Government" },
  ];

  let sectorData = [];
  // array of promises bc fetching sector data
  //makign array of promises one set
  const allDataPromises = sectors.map((value) =>
    fetch(
      `https://api.bls.gov/publicAPI/v2/timeseries/data/${value.code}?registrationkey=${apiKey}`
    )
      .then((response) => response.json())
      .then((json) =>
      //adds data to array
        sectorData.push({ name: value.name, data: json.Results.series[0].data })
      )
  );

  await Promise.all(allDataPromises);
  //execute all promises
  //await wait until results

  console.log("data", sectorData);

  const labels = sectorData[0].data.map(
    (value) => `${value.period.substring(1)}/${value.year}`
  );
  console.log("Labels", labels);
  //making labels going through all array of data period year
  //map operation takes in a function applies to all items in array and return results as an array of items

  const dataSet = sectorData.map((value) => {
    const red = Math.floor(Math.random() * 255);
    const green = Math.floor(Math.random() * 255);
    const blue = Math.floor(Math.random() * 255);
  //applying colors and values
    return {
      label: value.name,
      data: value.data.map((dataValue) => dataValue.value),
      borderColor: `rgb(${red}, ${green}, ${blue})`,
      backgroundColor: `rgba(${red}, ${green}, ${blue}, 0.5)`,
      hidden: false,
    };
  });

  const data = {
    labels: labels,
    datasets: dataSet,
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Number of Employees in Thousands",
        },
      },
    },
  };
  //    console.log(config);

  document.getElementById("loading").remove();
  const myChart = new Chart(document.getElementById("myChart"), config);

};

start();
